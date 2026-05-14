import { type Address, type Hex, type PublicClient, type WalletClient } from "viem";

import { PoAManagerAbi, PoAManagerBytecode } from "./artifacts/PoAManager.js";
import { ValidatorManagerAbi, ValidatorManagerBytecode } from "./artifacts/ValidatorManager.js";
import { ValidatorMessagesAbi, ValidatorMessagesBytecode } from "./artifacts/ValidatorMessages.js";
import { deployAndAwait } from "./_evmHelpers.js";
import { linkBytecode, listUnlinkedLibraries } from "./linkBytecode.js";

/**
 * ValidatorManager constructor argument.
 *
 * Pass `Allowed` (0) when deploying the implementation directly and you intend
 * to call `initialize(settings)` on the deployed contract. Pass `Disallowed` (1)
 * if you're deploying a behind-a-proxy implementation that must not be
 * initialized directly.
 */
export enum ICMInitializable {
    Allowed = 0,
    Disallowed = 1,
}

/**
 * Settings struct passed to `ValidatorManager.initialize(...)`.
 *
 * @param admin                  - EVM address with admin privileges (`Ownable`).
 *                                 For a PoA setup this is typically the
 *                                 PoAManager contract; for a raw deployment
 *                                 it's the deployer's address.
 * @param subnetID               - 32-byte subnet ID, hex-encoded.
 * @param churnPeriodSeconds     - Length of the validator-churn window in
 *                                 seconds. `0` disables churn limiting.
 * @param maximumChurnPercentage - Max percentage of total stake that can
 *                                 churn within a single window (0-100).
 */
export interface ValidatorManagerSettings {
    admin: Address;
    subnetID: Hex;
    churnPeriodSeconds: bigint;
    maximumChurnPercentage: number;
}

export interface DeployValidatorManagerArgs {
    /**
     * Settings passed to `ValidatorManager.initialize(...)` immediately after
     * deployment. Pass `null` to skip the initialize call (e.g. when you're
     * deploying the implementation behind a proxy and will initialize via the
     * proxy's calldata).
     */
    initSettings: ValidatorManagerSettings | null;
    /**
     * Optional override for the ValidatorMessages library address. When
     * omitted, this helper deploys a fresh ValidatorMessages library on the
     * same chain and links its address into the ValidatorManager bytecode.
     * Pass an existing address to skip the library deploy.
     */
    validatorMessagesAddress?: Address;
}

export interface DeployValidatorManagerResult {
    /** Deployed ValidatorManager address. */
    address: Address;
    /** ValidatorMessages library address used for linking. */
    libraryAddress: Address;
    /** Transaction hash of the ValidatorManager deploy. */
    deployTxHash: Hex;
    /** Transaction hash of the `initialize(...)` call, if it ran. */
    initializeTxHash?: Hex;
}

/**
 * Deploy a fresh `ValidatorManager` contract on the connected EVM chain.
 *
 * Performs (in order):
 *   1. If `validatorMessagesAddress` not supplied, deploy `ValidatorMessages`
 *      library and capture its address.
 *   2. Substitute the library address into the ValidatorManager bytecode
 *      placeholders.
 *   3. Deploy `ValidatorManager(ICMInitializable.Allowed)`.
 *   4. If `initSettings` supplied, call `initialize(settings)` on the new
 *      contract.
 *
 * Network calls are awaited end-to-end, so the returned addresses are usable
 * immediately by callers (no extra wait-for-receipt needed).
 */
export async function deployValidatorManager(
    walletClient: WalletClient,
    publicClient: PublicClient,
    args: DeployValidatorManagerArgs,
): Promise<DeployValidatorManagerResult> {
    // 1. Library (deploy if not provided).
    const libraryAddress =
        args.validatorMessagesAddress ??
        (
            await deployAndAwait(walletClient, publicClient, {
                abi: ValidatorMessagesAbi,
                bytecode: ValidatorMessagesBytecode,
                label: "ValidatorMessages library",
            })
        ).address;

    // 2. Link the library address into the ValidatorManager bytecode.
    const linkedBytecode = linkBytecode(ValidatorManagerBytecode, libraryAddress);
    const remaining = listUnlinkedLibraries(linkedBytecode);
    if (remaining.length > 0) {
        throw new Error(
            `ValidatorManager bytecode still has unresolved library links after link: ${remaining.join(", ")}`,
        );
    }

    // 3. Deploy ValidatorManager(ICMInitializable.Allowed).
    const { address, txHash: deployTxHash } = await deployAndAwait(walletClient, publicClient, {
        abi: ValidatorManagerAbi,
        bytecode: linkedBytecode,
        args: [ICMInitializable.Allowed],
        label: "ValidatorManager",
    });

    // 4. Optional initialize.
    let initializeTxHash: Hex | undefined;
    if (args.initSettings) {
        initializeTxHash = await walletClient.writeContract({
            address,
            abi: ValidatorManagerAbi,
            functionName: "initialize",
            args: [args.initSettings],
            chain: walletClient.chain,
            account: walletClient.account ?? null,
        } as never);
        await publicClient.waitForTransactionReceipt({ hash: initializeTxHash });
    }

    const result: DeployValidatorManagerResult = { address, libraryAddress, deployTxHash };
    if (initializeTxHash) result.initializeTxHash = initializeTxHash;
    return result;
}

/**
 * Deploy a `PoAManager` standalone contract that wraps an already-deployed
 * `ValidatorManager` (passed as `validatorManager`).
 *
 * Callers typically follow up by transferring `ValidatorManager` ownership
 * to the deployed PoAManager via `transferOwnership(...)`.
 */
export async function deployPoAManager(
    walletClient: WalletClient,
    publicClient: PublicClient,
    args: { initialOwner: Address; validatorManager: Address },
): Promise<{ address: Address; deployTxHash: Hex }> {
    const { address, txHash } = await deployAndAwait(walletClient, publicClient, {
        abi: PoAManagerAbi,
        bytecode: PoAManagerBytecode,
        args: [args.initialOwner, args.validatorManager],
        label: "PoAManager",
    });
    return { address, deployTxHash: txHash };
}

// Re-export artifacts so consumers can compose their own deploy flow if needed.
export {
    PoAManagerAbi,
    PoAManagerBytecode,
    ValidatorManagerAbi,
    ValidatorManagerBytecode,
    ValidatorMessagesAbi,
    ValidatorMessagesBytecode,
};
