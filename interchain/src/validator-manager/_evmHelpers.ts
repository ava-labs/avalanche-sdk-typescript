import type {
    Abi,
    Address,
    DeployContractParameters,
    Hex,
    PublicClient,
    WalletClient,
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
