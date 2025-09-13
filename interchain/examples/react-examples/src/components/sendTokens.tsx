import { avalancheFuji, dispatch } from "@avalanche-sdk/interchain/chains";
import { useEffect, useState } from "react";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import SourceAndDestinationChains from "./ictt/0_sourceAndDestinationChains";
import DeployERC20 from "./ictt/1_deployERC20";
import DeployTokenHome from "./ictt/2_deployTokenHome";
import RegisterRemoteWithHome from "./ictt/4_registerRemoteWithHome";
import DeployTokenRemote from "./ictt/3_deployTokenRemote";
import ApproveERC20Spending from "./ictt/5_approveERC20Spending";
import TransferTokens from "./ictt/6_transferTokens";

export default function SendTokens() {
    // Hardcoded private key for demonstration purposes.
    // Do not use this in production. For browser based applications, consider using a secure wallet provider
    // like MetaMask or WalletConnect.
    const account = privateKeyToAccount('0x63e0730edea86f6e9e95db48dbcab18406e60bebae45ad33e099f09d21450ebf');

    // State variables for source and destination chains
    const [sourceChain, setSourceChain] = useState(avalancheFuji.name);
    const [destinationChain, setDestinationChain] = useState(dispatch.name);
    const [sourceChainConfig, setSourceChainConfig] = useState(avalancheFuji);
    const [destinationChainConfig, setDestinationChainConfig] = useState(dispatch);

    const defaultWalletClient = createWalletClient({
        chain: sourceChainConfig,
        transport: http(),
        account,
    });
    const [sourceWallet, setSourceWallet] = useState(defaultWalletClient);
    const [destinationWallet, setDestinationWallet] = useState(defaultWalletClient);

    // State variables required during interchain token transfers
    const [tokenAddress, setTokenAddress] = useState("");
    const [tokenHomeContract, setTokenHomeContract] = useState("");
    const [tokenRemoteContract, setTokenRemoteContract] = useState("");

    // Updates wallet and config based on the selected source and destination chains
    useEffect(() => {
        const sourceChainConfig = sourceChain === "Avalanche Fuji" ? avalancheFuji : dispatch;
        const destinationChainConfig = destinationChain === "Avalanche Fuji" ? avalancheFuji : dispatch;
        const sourceWallet = createWalletClient({
            chain: sourceChainConfig,
            transport: http(),
            account,
        });
        const destinationWallet = createWalletClient({
            chain: destinationChainConfig,
            transport: http(),
            account,
        });
        setSourceChainConfig(sourceChainConfig);
        setDestinationChainConfig(destinationChainConfig);
        setSourceWallet(sourceWallet);
        setDestinationWallet(destinationWallet);
    }, [sourceChain, destinationChain]);

    return (
        <div>
            <h1>Send Tokens</h1>

            <SourceAndDestinationChains
                sourceChain={sourceChain}
                destinationChain={destinationChain}
                setSourceChain={setSourceChain}
                setDestinationChain={setDestinationChain}
            />

            <DeployERC20
                tokenAddress={tokenAddress}
                setTokenAddress={setTokenAddress}
                sourceChain={sourceChainConfig}
                sourceWallet={sourceWallet}
            />

            <DeployTokenHome
                tokenAddress={tokenAddress}
                tokenHomeContract={tokenHomeContract}
                setTokenHomeContract={setTokenHomeContract}
                sourceWallet={sourceWallet}
                sourceChain={sourceChainConfig}
            />

            <DeployTokenRemote
                sourceChain={sourceChainConfig}
                destinationChain={destinationChainConfig}
                destinationWallet={destinationWallet}
                tokenHomeContract={tokenHomeContract}
                tokenRemoteAddress={tokenRemoteContract}
                setTokenRemoteAddress={setTokenRemoteContract}
            />

            <RegisterRemoteWithHome
                destinationWallet={destinationWallet}
                sourceChain={sourceChainConfig}
                destinationChain={destinationChainConfig}
                tokenRemoteAddress={tokenRemoteContract}
            />

            <ApproveERC20Spending
                sourceWallet={sourceWallet}
                sourceChain={sourceChainConfig}
                tokenHomeContract={tokenHomeContract}
                erc20TokenAddress={tokenRemoteContract}
            />

            <TransferTokens
                sourceWallet={sourceWallet}
                sourceChain={sourceChainConfig}
                destinationChain={destinationChainConfig}
                tokenHomeContract={tokenHomeContract}
                tokenRemoteContract={tokenRemoteContract}
            />
        </div>
    )
}