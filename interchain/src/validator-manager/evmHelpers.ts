import { utils } from "@avalabs/avalanchejs";
import {
    bytesToHex,
    type Abi,
    type AccessList,
    type Account,
    type Address,
    type DeployContractParameters,
    type Hex,
    type PublicClient,
    type TransactionReceipt,
    type WalletClient,
} from "viem";

/**
 * Deploy a contract, wait for its receipt, and return the deployed address.
 *
 * Fills in `chain` + `account` from the wallet client and throws if the
 * receipt's `contractAddress` is null (e.g. a deploy that reverted).
 *
 * `label` is used purely for error messages — pass the contract name.
 */
export async function deployAndAwait(
    wc: WalletClient,
    pc: PublicClient,
    params: { abi: Abi; bytecode: Hex; args?: readonly unknown[]; label: string },
): Promise<{ address: Address; txHash: Hex }> {
    const txHash = await wc.deployContract({
        abi: params.abi,
        bytecode: params.bytecode,
        args: params.args,
        chain: wc.chain,
        account: wc.account ?? null,
    } as unknown as DeployContractParameters);
    const receipt = await pc.waitForTransactionReceipt({ hash: txHash });
    if (!receipt.contractAddress) {
        throw new Error(`${params.label} deploy did not produce a contract address (tx ${txHash})`);
    }
    return { address: receipt.contractAddress, txHash };
}

/**
 * Re-encode a base58check ID (32-byte payload — subnetID, blockchainID,
 * validationID) as a 0x-prefixed 32-byte hex string.
 */
export function base58checkToBytes32Hex(id: string): Hex {
    return bytesToHex(utils.base58check.decode(id));
}

/**
 * Throw with a useful revert reason when a tx receipt is not `success`.
 *
 * Replays the failed call as `eth_call` against `receipt.blockNumber - 1`
 * so the contract state matches the pre-tx state — viem decodes any custom
 * error / revert string from the replay and surfaces it in the thrown
 * `Error.message`. Replaying against `receipt.blockNumber` itself would
 * use post-tx state, where the revert condition may no longer trigger.
 *
 * Use after `waitForTransactionReceipt` for any contract call where a
 * status=reverted with no detail would otherwise leave the caller blind.
 */
export async function assertSuccessOrReplay(
    publicClient: PublicClient,
    args: {
        receipt: TransactionReceipt;
        contractAddress: Address;
        callData: Hex;
        accessList?: AccessList;
        account?: Account | Address;
        opName?: string;
    },
): Promise<void> {
    if (args.receipt.status === "success") return;

    let revertReason = "<eth_call replay produced no error>";
    try {
        await publicClient.call({
            to: args.contractAddress,
            data: args.callData,
            account: args.account,
            accessList: args.accessList,
            blockNumber: args.receipt.blockNumber - 1n,
        } as never);
    } catch (err: unknown) {
        revertReason = err instanceof Error ? err.message : String(err);
    }
    const op = args.opName ?? "transaction";
    throw new Error(
        `${op} reverted on-chain (tx ${args.receipt.transactionHash}, block ${args.receipt.blockNumber}): ${revertReason}`,
    );
}
