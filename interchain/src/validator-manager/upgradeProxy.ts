import {
    encodeFunctionData,
    type Address,
    type Hex,
} from "viem";

import { ProxyAdminAbi } from "./artifacts/ProxyAdmin.js";
import { ValidatorManagerAbi } from "./artifacts/ValidatorManager.js";
import {
    deployValidatorManager,
    ICMInitializable,
    type ValidatorManagerSettings,
} from "./deployValidatorManager.js";
import {
    VALIDATOR_MANAGER_PROXY_ADDRESS,
    VALIDATOR_MANAGER_PROXY_ADMIN_ADDRESS,
} from "./constants.js";
import type { MinimalWalletClient, MinimalPublicClient } from "./clientTypes.js";

export interface UpgradeProxyToValidatorManagerArgs {
    /**
     * The proxy address. Defaults to {@link VALIDATOR_MANAGER_PROXY_ADDRESS}
     * (the canonical genesis pre-deploy slot).
     */
    proxyAddress?: Address;
    /**
     * The ProxyAdmin address. Defaults to
     * {@link VALIDATOR_MANAGER_PROXY_ADMIN_ADDRESS}.
     */
    proxyAdminAddress?: Address;
    /** Settings passed to `ValidatorManager.initialize(settings)`. */
    initSettings: ValidatorManagerSettings;
    /**
     * Optional pre-deployed ValidatorMessages library address. When omitted,
     * a fresh library will be deployed on the same chain.
     */
    validatorMessagesAddress?: Address;
}

export interface UpgradeProxyToValidatorManagerResult {
    /**
     * The proxy address — this is what callers should use as the "validator
     * manager address" for downstream interactions (initializeValidatorSet,
     * registerL1Validator, etc.). Same address as `proxyAddress` input.
     */
    address: Address;
    /** Address of the newly-deployed ValidatorManager implementation. */
    implementationAddress: Address;
    /** ValidatorMessages library address linked into the implementation. */
    libraryAddress: Address;
    /** Tx hash of the implementation deploy. */
    deployTxHash: Hex;
    /** Tx hash of the ProxyAdmin.upgradeAndCall(...) call. */
    upgradeTxHash: Hex;
}

/**
 * Upgrade a genesis-pre-deployed TransparentUpgradeableProxy to point at a
 * freshly deployed `ValidatorManager` implementation, initializing it in the
 * same call via `ProxyAdmin.upgradeAndCall(...)`.
 *
 * The flow:
 *   1. Deploy ValidatorManager (with `ICMInitializable.Disallowed` so the
 *      implementation can't be initialized directly — only via the proxy).
 *   2. Encode `initialize(settings)` as calldata.
 *   3. Call `ProxyAdmin.upgradeAndCall(proxy, impl, calldata)` — atomically
 *      sets the implementation slot AND runs the initializer behind the
 *      proxy's storage.
 *
 * After this returns, the proxy at {@link UpgradeProxyToValidatorManagerArgs.proxyAddress}
 * is a fully-initialized ValidatorManager, and downstream calls (incl.
 * `initializeValidatorSet`) should target the proxy address.
 *
 * Requires that:
 *   - The proxy + ProxyAdmin exist on-chain (via {@link buildValidatorManagerGenesisAlloc}).
 *   - The caller's account is the ProxyAdmin's owner.
 */
export async function upgradeProxyToValidatorManager(
    walletClient: MinimalWalletClient,
    publicClient: MinimalPublicClient,
    args: UpgradeProxyToValidatorManagerArgs,
): Promise<UpgradeProxyToValidatorManagerResult> {
    const proxyAddress = (args.proxyAddress ??
        VALIDATOR_MANAGER_PROXY_ADDRESS) as Address;
    const proxyAdminAddress = (args.proxyAdminAddress ??
        VALIDATOR_MANAGER_PROXY_ADMIN_ADDRESS) as Address;

    // 1. Deploy the implementation with ICMInitializable.Disallowed so it
    //    can't be initialized directly — only via the proxy's calldata in
    //    step 3.
    const implResult = await deployValidatorManager(walletClient, publicClient, {
        icmInitializable: ICMInitializable.Disallowed,
        ...(args.validatorMessagesAddress !== undefined && {
            validatorMessagesAddress: args.validatorMessagesAddress,
        }),
    });

    // 2. Encode initialize(settings) calldata for the proxy upgrade.
    const initializeCalldata = encodeFunctionData({
        abi: ValidatorManagerAbi,
        functionName: "initialize",
        args: [args.initSettings],
    });

    // 3. Upgrade the proxy + initialize in one tx via ProxyAdmin.
    const upgradeTxHash = await walletClient.writeContract({
        address: proxyAdminAddress,
        abi: ProxyAdminAbi,
        functionName: "upgradeAndCall",
        args: [proxyAddress, implResult.address, initializeCalldata],
        chain: walletClient.chain,
        account: walletClient.account ?? null,
    } as never);
    await publicClient.waitForTransactionReceipt({ hash: upgradeTxHash });

    return {
        address: proxyAddress,
        implementationAddress: implResult.address,
        libraryAddress: implResult.libraryAddress,
        deployTxHash: implResult.deployTxHash,
        upgradeTxHash,
    };
}
