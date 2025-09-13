import { createICTTClient } from "@avalanche-sdk/interchain/ictt";
import { useState } from "react";
import { type WalletClient } from "viem";

export default function DeployTokenHome(props: {
    tokenAddress: string,
    tokenHomeContract: string,
    setTokenHomeContract: (address: string) => void,
    sourceWallet: WalletClient,
    sourceChain: ChainConfig,
}) {
    const icttClient = createICTTClient();

    const [isLoading, setIsLoading] = useState(false);

    async function deployTokenHome() {
        setIsLoading(true);

        const { contractAddress: tokenHomeAddress } = await icttClient.deployTokenHomeContract({
            walletClient: props.sourceWallet,
            sourceChain: props.sourceChain,
            erc20TokenAddress: props.tokenAddress as `0x${string}`,
            minimumTeleporterVersion: 1,
        });
        props.setTokenHomeContract(tokenHomeAddress);
        setIsLoading(false);
    }

    return (
        <div>
            <h3>Deploy Token Home</h3>

            <label>ERC20 Token (Deploy ERC20 from above)</label><br/>
            <input type="text" value={props.tokenAddress} placeholder="ERC20 not deployed" readOnly /><br/>

            {props.tokenHomeContract && <p>Token Home Address: <a href={`${props.sourceChain.blockExplorers?.default.url}/address/${props.tokenHomeContract}`} target="_blank" rel="noopener noreferrer">{props.tokenHomeContract}</a></p>}
            <br />

            <button onClick={deployTokenHome} disabled={isLoading}>
                {isLoading ? "Deploying..." : "Deploy Token Home"}
            </button>
        </div>
    )
}