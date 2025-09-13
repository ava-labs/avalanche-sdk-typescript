import { createICTTClient } from "@avalanche-sdk/interchain/ictt";
import { useState } from "react";
import { type WalletClient } from "viem";

export default function TransferTokens(props: {
    sourceWallet: WalletClient,
    sourceChain: ChainConfig,
    destinationChain: ChainConfig,
    tokenHomeContract: string,
    tokenRemoteContract: string,
}) {
    const icttClient = createICTTClient();

    const [amountInBaseUnit, setAmountInBaseUnit] = useState(0);
    const [recipient, setRecipient] = useState("");
    const [txHash, setTxHash] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function deployTokenRemote() {
        setIsLoading(true);

        const { txHash } = await icttClient.sendToken({
            walletClient: props.sourceWallet,
            sourceChain: props.sourceChain,
            destinationChain: props.destinationChain,
            tokenHomeContract: props.tokenHomeContract as `0x${string}`,
            tokenRemoteContract: props.tokenRemoteContract as `0x${string}`,
            amountInBaseUnit: amountInBaseUnit,
            recipient: recipient as `0x${string}`,
        });
        setTxHash(txHash);
        setIsLoading(false);
    }

    return (
        <div>
            <h3>Transfer Tokens</h3>

            <label>Token Home (Deploy contract from above)</label><br/>
            <input type="text" value={props.tokenHomeContract} placeholder="Token Home not deployed" readOnly /><br/>

            <label>Token Remote (Deploy contract from above)</label><br/>
            <input type="text" value={props.tokenRemoteContract} placeholder="Token Remote not deployed" readOnly /><br/>

            <label>Amount in Base Unit</label><br/>
            <input type="number" value={amountInBaseUnit} placeholder="Amount in Base Unit" onChange={(e) => setAmountInBaseUnit(Number(e.target.value))} /><br/>

            <label>Recipient Address</label><br/>
            <input type="text" value={recipient} placeholder="Recipient Address" onChange={(e) => setRecipient(e.target.value)} /><br/>

            {txHash && <p>Transaction Hash: <a href={`${props.sourceChain.blockExplorers?.default.url}/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a></p>}
            <br />

            <button onClick={deployTokenRemote} disabled={isLoading}>
                {isLoading ? "Transferring..." : "Transfer Tokens"}
            </button>
        </div>
    )
}