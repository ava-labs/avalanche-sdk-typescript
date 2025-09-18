import { useState } from "react";
import { privateKeyToAccount } from "viem/accounts";
import { createICMClient } from "@avalanche-sdk/interchain";
import { createWalletClient, http } from "viem";
import { avalancheFuji, dispatch } from "@avalanche-sdk/interchain/chains";

function setupICMClient() {
    const account = privateKeyToAccount('0x63e0730edea86f6e9e95db48dbcab18406e60bebae45ad33e099f09d21450ebf');

    const wallet = createWalletClient({
        transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
        account,
    })

    return createICMClient(wallet);
}

export default function SendICM() {
    const [sourceChain, setSourceChain] = useState(avalancheFuji.name);
    const [destinationChain, setDestinationChain] = useState(dispatch.name);
    const [sourceChainConfig, setSourceChainConfig] = useState(avalancheFuji);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [txHash, setTxHash] = useState("");
    const icmClient = setupICMClient();

    async function sendICM() {
        setIsLoading(true);

        const sourceChainConfig = sourceChain === "Avalanche Fuji" ? avalancheFuji : dispatch;
        const destinationChainConfig = destinationChain === "Avalanche Fuji" ? avalancheFuji : dispatch;
        setSourceChainConfig(sourceChainConfig);

        const hash = await icmClient.sendMsg({
            sourceChain: sourceChainConfig,
            destinationChain: destinationChainConfig,
            message,
        });

        setIsLoading(false);
        setTxHash(hash);
    }

    return (
        <div>
            <h1>Send ICM</h1>

            <label>Select Source Chain</label><br/>
            <select value={sourceChain} onChange={e => setSourceChain(e.target.value)}>
                <option value={avalancheFuji.name}>{avalancheFuji.name}</option>
                <option value={dispatch.name}>{dispatch.name}</option>
            </select><br/><br/>

            <label>Select Destination Chain</label><br/>
            <select value={destinationChain} onChange={e => setDestinationChain(e.target.value)}>
                <option value={avalancheFuji.name}>{avalancheFuji.name}</option>
                <option value={dispatch.name}>{dispatch.name}</option>
            </select><br/><br/>

            <textarea
                rows={4} cols={50}
                placeholder="Enter your message here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
            ></textarea><br/>

            {txHash && <p>Transaction Hash: <a href={`${sourceChainConfig.blockExplorers?.default.url}/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a></p>}

            <br/><button onClick={sendICM} disabled={isLoading}>
                {isLoading ? "Sending..." : "Send ICM"}
            </button>
        </div>
    );
}
