import { Address, WalletClient } from "viem";
import { ChainConfig } from "../icm/types/chainConfig";
import { tokenHomeABI } from "../abis/tokenHomeABI";
import { erc20ABI } from "../abis/erc20ABI";
import { DEFAULT_TELEPORTER_ADDRESS } from "../icm/consts";
import { tokenRemoteABI } from "../abis/tokenRemoteABI";

// TODO: Add dev docs
export class ICTT {
    private walletClient: WalletClient;
    private sourceChain: ChainConfig | undefined;
    private destinationChain: ChainConfig | undefined;
    private gasLimit: bigint;

    constructor(
        walletClient: WalletClient,
        sourceChain?: ChainConfig,
        destinationChain?: ChainConfig,
        gasLimit?: bigint,
    ) {
        this.walletClient = walletClient;
        this.sourceChain = sourceChain;
        this.destinationChain = destinationChain;
        this.gasLimit = gasLimit ?? BigInt(250000);
    }

    async approveToken(
        tokenHomeContract: `0x${string}`,
        tokenAddress: `0x${string}`,
        amountInBaseUnit: number,
        sourceChain: ChainConfig | undefined,
    ) {
        const amountInWei = BigInt(amountInBaseUnit) * BigInt(10 ** 18);
        const approveTxHash = await this.walletClient.writeContract({
            address: tokenAddress,
            abi: erc20ABI.abi,
            functionName: "approve",
            args: [tokenHomeContract, amountInWei],
            chain: sourceChain ?? this.sourceChain,
            account: this.walletClient.account ?? null,
        });
        return approveTxHash;
    }

    async deployTokenHomeContract(
        sourceChain: ChainConfig | undefined,
        teleporterRegistry: Address,
        erc20TokenAddress: Address,
        erc20TokenDecimals: number,
        minimumTeleporterVersion: number,
    ) {
        return await this.walletClient.deployContract({
            abi: tokenHomeABI.abi,
            bytecode: tokenHomeABI.bytecode as `0x${string}`,
            args: [
                teleporterRegistry,
                DEFAULT_TELEPORTER_ADDRESS,
                minimumTeleporterVersion,
                erc20TokenAddress,
                erc20TokenDecimals,
            ],
            chain: sourceChain ?? this.sourceChain ?? null,
            account: this.walletClient.account ?? null,
        });
    }

    async deployTokenRemoteContract(
        destinationChain: ChainConfig | undefined,
        teleporterRegistry: Address,
        minimumTeleporterVersion: number,
        tokenHomeBlockchainID: string,
        tokenHomeAddress: Address,
        tokenHomeDecimals: number,
        tokenName: string,
        tokenSymbol: string,
        destinationTokenDecimals: number,
    ) {
        return await this.walletClient.deployContract({
            abi: tokenRemoteABI.abi,
            bytecode: tokenRemoteABI.bytecode as `0x${string}`,
            args: [
                {
                    teleporterRegistryAddress: teleporterRegistry,
                    teleporterManager: DEFAULT_TELEPORTER_ADDRESS,
                    minTeleporterVersion: BigInt(minimumTeleporterVersion),
                    tokenHomeBlockchainID: tokenHomeBlockchainID,
                    tokenHomeAddress: tokenHomeAddress,
                    tokenHomeDecimals: Number(tokenHomeDecimals), // uint8
                },
                tokenName,
                tokenSymbol,
                Number(destinationTokenDecimals)
            ],
            chain: destinationChain ?? this.destinationChain ?? null,
            account: this.walletClient.account ?? null,
        });
    }

    async sendToken(
        tokenHomeContract: Address,
        tokenRemoteContract: Address,
        recipient: Address,
        tokenAddress: Address,
        amountInBaseUnit: number,
        sourceChain: ChainConfig | undefined,
        destinationChain: ChainConfig | undefined,
    ) {
        const amountInWei = BigInt(amountInBaseUnit) * BigInt(10 ** 18);
        const sendTokensInput = {
            destinationBlockchainID: destinationChain?.blockchainId ?? this.destinationChain?.blockchainId,
            destinationTokenTransferrerAddress: tokenRemoteContract,
            recipient,
            primaryFeeTokenAddress: tokenAddress,
            primaryFee: 0,
            secondaryFee: 0,
            requiredGasLimit: this.gasLimit,
            multiHopFallback: '0x0000000000000000000000000000000000000000',
        };

        const sendTxHash = await this.walletClient.writeContract({
            address: tokenHomeContract,
            abi: tokenHomeABI.abi,
            functionName: 'send',
            args: [sendTokensInput, amountInWei],
            chain: sourceChain,
            account: this.walletClient.account ?? null,
        });

        return sendTxHash;
    }
}

export function createICTTClient(
    walletClient: WalletClient,
    sourceChain?: ChainConfig,
    destinationChain?: ChainConfig,
    gasLimit?: bigint,
) {
    return new ICTT(walletClient, sourceChain, destinationChain, gasLimit);
}
