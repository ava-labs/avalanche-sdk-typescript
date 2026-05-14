import { type Address, type Hex, type PublicClient, type WalletClient } from "viem";

import { PoAManagerAbi, PoAManagerBytecode } from "./artifacts/PoAManager.js";
import { deployAndAwait } from "./evmHelpers.js";

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
