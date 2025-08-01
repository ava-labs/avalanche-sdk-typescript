import { createWalletClient } from "viem";
import { http } from "viem";
import { createICTTClient } from "../src/ictt/ictt";
import { privateKeyToAccount } from "viem/accounts";
import { avalancheFuji, dispatch } from "../src/chains";

const account = privateKeyToAccount('0x63e0730edea86f6e9e95db48dbcab18406e60bebae45ad33e099f09d21450ebf');

const fujiWallet = createWalletClient({
    chain: avalancheFuji,
    transport: http(),
    account,
})

const dispatchWallet = createWalletClient({
    chain: dispatch,
    transport: http(),
    account,
})

const ictt = createICTTClient(
    avalancheFuji,
    dispatch,
);

async function main() {
    const { contractAddress: tokenAddress } = await ictt.deployERC20Token({
        walletClient: fujiWallet,
        sourceChain: avalancheFuji,
        name: 'Test Token',
        symbol: 'TEST',
        initialSupply: 1000000,
    });
    console.log(`Token deployed on Avalanche Fuji: ${tokenAddress}`);

    const { contractAddress: tokenHomeContract } = await ictt.deployTokenHomeContract({
        walletClient: fujiWallet,
        sourceChain: avalancheFuji,
        erc20TokenAddress: tokenAddress,
        minimumTeleporterVersion: 1,
    });
    console.log(`Token home contract deployed on Avalanche Fuji: ${tokenHomeContract}`);

    const { contractAddress: tokenRemoteContract } = await ictt.deployTokenRemoteContract({
        walletClient: dispatchWallet,
        sourceChain: avalancheFuji,
        destinationChain: dispatch,
        tokenHomeContract,
    });
    console.log(`Token remote contract deployed on Dispatch: ${tokenRemoteContract}`);

    const { txHash: registerRemoteWithHomeTxHash } = await ictt.registerRemoteWithHome({
        walletClient: dispatchWallet,
        sourceChain: avalancheFuji,
        destinationChain: dispatch,
        tokenRemoteContract,
    })
    console.log(`Token remote contract registered with home on Dispatch: ${registerRemoteWithHomeTxHash}`);

    const { txHash: approveTokenTxHash } = await ictt.approveToken({
        walletClient: fujiWallet,
        sourceChain: avalancheFuji,
        tokenHomeContract,
        tokenAddress,
        amountInBaseUnit: 2,
    })
    console.log(`Token approved on Avalanche Fuji: ${approveTokenTxHash}`);

    const { txHash: sendTokenTxHash } = await ictt.sendToken({
        walletClient: fujiWallet,
        sourceChain: avalancheFuji,
        destinationChain: dispatch,
        tokenHomeContract,
        tokenRemoteContract,
        amountInBaseUnit: 1,
        recipient: '0x909d71Ed4090ac6e57E3645dcF2042f8c6548664',
    })
    console.log(`Token sent from Avalanche Fuji to Dispatch: ${sendTokenTxHash}`);
}

main().catch(console.error);