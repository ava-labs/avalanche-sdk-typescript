import { createICTTClient,  } from "@avalanche-sdk/interchain/ictt";
import { useState } from "react";
import { type WalletClient } from "viem";

export default function DeployERC20(props: {
    tokenAddress: string,
    setTokenAddress: (address: string) => void,
    sourceWallet: WalletClient,
    sourceChain: ChainConfig,
}) {
    const icttClient = createICTTClient();

    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [initialSupply, setInitialSupply] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    async function deployERC20Token() {
        setIsLoading(true);
        const { contractAddress: tokenAddress } = await icttClient.deployERC20Token({
            walletClient: props.sourceWallet,
            sourceChain: props.sourceChain,
            name: tokenName,
            symbol: tokenSymbol,
            initialSupply: initialSupply,
        });
        props.setTokenAddress(tokenAddress);
        setIsLoading(false);
    }

    return (
        <div>
            <h3>Deploy ERC20</h3>

            <label>Token Details</label><br/>
            <input type="text" placeholder="Token Name" onChange={(e) => setTokenName(e.target.value)} />
            <input type="text" placeholder="Token Symbol" onChange={(e) => setTokenSymbol(e.target.value)} />
            <input type="number" placeholder="Initial Supply" onChange={(e) => setInitialSupply(Number(e.target.value))} /><br/>

            {props.tokenAddress && <p>Token Address: <a href={`${props.sourceChain.blockExplorers?.default.url}/address/${props.tokenAddress}`} target="_blank" rel="noopener noreferrer">{props.tokenAddress}</a></p>}
            <br />

            <button onClick={deployERC20Token} disabled={isLoading}>
                {isLoading ? "Deploying..." : "Deploy ERC20"}
            </button>
        </div>
    )
}