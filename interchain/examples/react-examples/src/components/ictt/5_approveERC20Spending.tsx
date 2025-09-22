import { createICTTClient } from "@avalanche-sdk/interchain/ictt";
import { useState } from "react";
import { type WalletClient } from "viem";

export default function ApproveERC20Spending(props: {
    sourceWallet: WalletClient,
    sourceChain: ChainConfig,
    tokenHomeContract: string,
    erc20TokenAddress: string,
}) {
    const icttClient = createICTTClient();

    const [amountInBaseUnit, setAmountInBaseUnit] = useState(0);
    const [approveTokenTxHash, setApproveTokenTxHash] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function deployTokenRemote() {
        setIsLoading(true);

        const { txHash: approveTokenTxHash } = await icttClient.approveToken({
            walletClient: props.sourceWallet,
            sourceChain: props.sourceChain,
            tokenHomeContract: props.tokenHomeContract as `0x${string}`,
            tokenAddress: props.erc20TokenAddress as `0x${string}`,
            amountInBaseUnit: amountInBaseUnit,
        });
        setApproveTokenTxHash(approveTokenTxHash);
        setIsLoading(false);
    }

    return (
        <div>
            <h3>Approve Home Contract to Spend ERC20</h3>

            <label>Token Home (Deploy contract from above)</label><br/>
            <input type="text" value={props.tokenHomeContract} placeholder="Token Home not deployed" readOnly /><br/>

            <label>ERC20 Token Address</label><br/>
            <input type="text" value={props.erc20TokenAddress} placeholder="ERC20 Token Address not deployed" readOnly /><br/>

            <label>Amount in Base Unit</label><br/>
            <input type="number" value={amountInBaseUnit} placeholder="Amount in Base Unit" onChange={(e) => setAmountInBaseUnit(Number(e.target.value))} /><br/>

            {approveTokenTxHash && <p>Transaction Hash: <a href={`${props.sourceChain.blockExplorers?.default.url}/tx/${approveTokenTxHash}`} target="_blank" rel="noopener noreferrer">{approveTokenTxHash}</a></p>}
            <br />

            <button onClick={deployTokenRemote} disabled={isLoading}>
                {isLoading ? "Approving..." : "Approve Token Spending"}
            </button>
        </div>
    )
}