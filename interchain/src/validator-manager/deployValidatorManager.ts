import { type Address, type Hex } from "viem";

import { ValidatorManagerAbi, ValidatorManagerBytecode } from "./artifacts/ValidatorManager.js";
import { ValidatorMessagesAbi, ValidatorMessagesBytecode } from "./artifacts/ValidatorMessages.js";
import { deployAndAwait } from "./evmHelpers.js";
import { linkBytecode, listUnlinkedLibraries } from "./linkBytecode.js";
import type { MinimalWalletClient, MinimalPublicClient } from "./clientTypes.js";

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
     * Constructor argument for `ValidatorManager`. Defaults to
     * {@link ICMInitializable.Allowed} (callers expect to invoke
     * `initialize(settings)` on the deployed contract directly). Pass
     * {@link ICMInitializable.Disallowed} when deploying behind a proxy
     * (initialize then runs via the proxy's calldata).
     */
    icmInitializable?: ICMInitializable;
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
}

/**
 * Deploy a fresh `ValidatorManager` contract on the connected EVM chain.
 *
 * Performs (in order):
 *   1. If `validatorMessagesAddress` not supplied, deploy `ValidatorMessages`
 *      library and capture its address.
 *   2. Substitute the library address into the ValidatorManager bytecode
 *      placeholders.
 *   3. Deploy `ValidatorManager(icmInitializable)`.
 *
 * Does NOT call `initialize(settings)` on the deployed contract — call
 * {@link initializeValidatorManager} afterwards (raw path), or use
 * `upgradeProxyToValidatorManager` (proxy path) which atomically deploys +
 * upgrades + initializes via `ProxyAdmin.upgradeAndCall`.
 *
 * Network calls are awaited end-to-end, so the returned addresses are usable
 * immediately by callers (no extra wait-for-receipt needed).
 */
export async function deployValidatorManager(
    walletClient: MinimalWalletClient,
    publicClient: MinimalPublicClient,
    args: DeployValidatorManagerArgs = {},
): Promise<DeployValidatorManagerResult> {
    const icmInitializable = args.icmInitializable ?? ICMInitializable.Allowed;

    const libraryAddress =
        args.validatorMessagesAddress ??
        (
            await deployAndAwait(walletClient, publicClient, {
                abi: ValidatorMessagesAbi,
                bytecode: ValidatorMessagesBytecode,
                label: "ValidatorMessages library",
            })
        ).address;

    const linkedBytecode = linkBytecode(ValidatorManagerBytecode, libraryAddress);
    const remaining = listUnlinkedLibraries(linkedBytecode);
    if (remaining.length > 0) {
        throw new Error(
            `ValidatorManager bytecode still has unresolved library links after link: ${remaining.join(", ")}`,
        );
    }

    const { address, txHash: deployTxHash } = await deployAndAwait(walletClient, publicClient, {
        abi: ValidatorManagerAbi,
        bytecode: linkedBytecode,
        args: [icmInitializable],
        label: "ValidatorManager",
    });

    return { address, libraryAddress, deployTxHash };
}

/**
 * Call `ValidatorManager.initialize(settings)` on a deployed instance.
 *
 * Only valid when the contract was deployed with
 * {@link ICMInitializable.Allowed}. For proxy-fronted deployments, use
 * `upgradeProxyToValidatorManager`, which runs the initializer behind the
 * proxy's storage via `ProxyAdmin.upgradeAndCall`.
 */
export async function initializeValidatorManager(
    walletClient: MinimalWalletClient,
    publicClient: MinimalPublicClient,
    args: { address: Address; settings: ValidatorManagerSettings },
): Promise<{ txHash: Hex }> {
    const txHash = await walletClient.writeContract({
        address: args.address,
        abi: ValidatorManagerAbi,
        functionName: "initialize",
        args: [args.settings],
        chain: walletClient.chain,
        account: walletClient.account ?? null,
    } as never);
    await publicClient.waitForTransactionReceipt({ hash: txHash });
    return { txHash };
}

// Re-export artifacts so consumers can compose their own deploy flow if needed.
export {
    ValidatorManagerAbi,
    ValidatorManagerBytecode,
    ValidatorMessagesAbi,
    ValidatorMessagesBytecode,
};
