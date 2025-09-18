import { createICTTClient } from "@avalanche-sdk/interchain/ictt";
import { useState } from "react";
import { type WalletClient } from "viem";

export default function DeployTokenRemote(props: {
    destinationWallet: WalletClient,
    sourceChain: ChainConfig,
    destinationChain: ChainConfig,
    tokenHomeContract: string,
    tokenRemoteAddress: string,
    setTokenRemoteAddress: (address: string) => void
}) {
    const icttClient = createICTTClient();

    const [isLoading, setIsLoading] = useState(false);

    async function deployTokenRemote() {
        setIsLoading(true);

        const { contractAddress: tokenRemoteAddress } = await icttClient.deployTokenRemoteContract({
            walletClient: props.destinationWallet,
            sourceChain: props.sourceChain,
            destinationChain: props.destinationChain,
            tokenHomeContract: props.tokenHomeContract as `0x${string}`,
        });
        props.setTokenRemoteAddress(tokenRemoteAddress);
        setIsLoading(false);
    }

    return (
        <div>
            <h3>Deploy Token Remote</h3>

            <label>Token Home Contract (Deploy contract from above)</label><br/>
            <input type="text" value={props.tokenHomeContract} placeholder="Token Home not deployed" readOnly /><br/>

            {props.tokenRemoteAddress && <p>Token Remote Address: <a href={`${props.destinationChain.blockExplorers?.default.url}/address/${props.tokenRemoteAddress}`} target="_blank" rel="noopener noreferrer">{props.tokenRemoteAddress}</a></p>}
            <br />

            <button onClick={deployTokenRemote} disabled={isLoading}>
                {isLoading ? "Deploying..." : "Deploy Token Remote"}
            </button>
        </div>
    )
}