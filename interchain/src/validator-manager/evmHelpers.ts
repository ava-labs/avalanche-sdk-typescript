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

    // Replay strategies — try a fresh block first (which sees the current state
    // including anything that landed in the failing block) and fall back to
    // block N-1 (pre-tx state). Whichever surfaces the real revert reason wins.
    const tries: Array<{ label: string; blockNumber?: bigint }> = [
        { label: "latest" },
        { label: `block-${args.receipt.blockNumber - 1n}`, blockNumber: args.receipt.blockNumber - 1n },
    ];
    let revertReason = "<eth_call replay produced no error>";
    for (const t of tries) {
        try {
            await publicClient.call({
                to: args.contractAddress,
                data: args.callData,
                account: args.account,
                accessList: args.accessList,
                ...(t.blockNumber !== undefined ? { blockNumber: t.blockNumber } : {}),
            } as never);
        } catch (err: unknown) {
            revertReason = `${t.label}: ${err instanceof Error ? err.message : String(err)}`;
            break;
        }
    }

    // Subnet-EVM-specific: warp predicate failures don't surface via eth_call
    // (eth_call doesn't run predicates), so fall back to `debug_traceTransaction`
    // on the failing tx itself. That replays the tx against its own block —
    // including predicate evaluation — and returns the abi-encoded revert
    // reason. Best-effort: the node may not have debug RPC enabled.
    if (revertReason.startsWith("<")) {
        try {
            const trace = (await publicClient.request({
                method: "debug_traceTransaction" as never,
                params: [args.receipt.transactionHash, { tracer: "callTracer" }] as never,
            } as never)) as { error?: string; revertReason?: string; output?: string };
            const reason =
                trace.revertReason ||
                trace.error ||
                (trace.output && trace.output !== "0x" ? `output=${trace.output}` : null);
            if (reason) revertReason = `debug_trace: ${reason}`;
        } catch (err: unknown) {
            // ignore — debug RPC may not be enabled
        }
    }
    const op = args.opName ?? "transaction";
    throw new Error(
        `${op} reverted on-chain (tx ${args.receipt.transactionHash}, block ${args.receipt.blockNumber}): ${revertReason}`,
    );
}
