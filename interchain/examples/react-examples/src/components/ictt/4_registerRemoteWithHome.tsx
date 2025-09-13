import { createICTTClient } from "@avalanche-sdk/interchain/ictt";
import { useState } from "react";
import { type WalletClient } from "viem";

export default function RegisterRemoteWithHome(props: {
    destinationWallet: WalletClient,
    sourceChain: ChainConfig,
    destinationChain: ChainConfig,
    tokenRemoteAddress: string,
}) {
    const icttClient = createICTTClient();

    const [registerRemoteWithHomeTxHash, setRegisterRemoteWithHomeTxHash] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function deployTokenRemote() {
        setIsLoading(true);

        const { txHash: registerRemoteWithHomeTxHash } = await icttClient.registerRemoteWithHome({
            walletClient: props.destinationWallet,
            sourceChain: props.sourceChain,
            destinationChain: props.destinationChain,
            tokenRemoteContract: props.tokenRemoteAddress as `0x${string}`,
        });
        setRegisterRemoteWithHomeTxHash(registerRemoteWithHomeTxHash);
        setIsLoading(false);
    }

    return (
        <div>
            <h3>Register Token Remote with Home</h3>

            <label>Token Remote Contract (Deploy contract from above)</label><br/>
            <input type="text" value={props.tokenRemoteAddress} placeholder="Token Remote not deployed" readOnly /><br/>

            {registerRemoteWithHomeTxHash && <p>Transaction Hash: <a href={`${props.destinationChain.blockExplorers?.default.url}/tx/${registerRemoteWithHomeTxHash}`} target="_blank" rel="noopener noreferrer">{registerRemoteWithHomeTxHash}</a></p>}
            <br />

            <button onClick={deployTokenRemote} disabled={isLoading}>
                {isLoading ? "Registering..." : "Register Token Remote"}
            </button>
        </div>
    )
}