import { createPublicClient, http } from "viem";
import { ChainConfig } from "../chains/types/chainConfig";
import { tokenHomeABI } from "../abis/tokenHomeABI";
import { DEFAULT_TELEPORTER_ADDRESS } from "../icm/consts";
import { tokenRemoteABI } from "../abis/tokenRemoteABI";
import { getERC20TokenInfo } from "./utils/getERC20TokenInfo";
import { getInfoFromTokenHomeContract } from "./utils/getInfoFromTokenHome";
import { DeployTokenHomeContractParams } from "./types/deployTokenHomeContractParams";
import { DeployTokenRemoteContractParams } from "./types/deployTokenRemoteContractParams";
import { RegisterRemoteWithHomeParams } from "./types/registerRemoteWithHomeParams";
import { SendTokenParams } from "./types/sendTokenParams";
import { deployERC20Token } from "./utils/deployERC20Token";
import { DeployERC20TokenParams } from "./types/deployERC20Token";
import { ApproveTokenParams } from "./types/approveTokenParams";
import { approveToken } from "./utils/approveToken";

export class ICTT {
    private sourceChain: ChainConfig | undefined;
    private destinationChain: ChainConfig | undefined;
    private gasLimit: bigint;

    constructor(
        sourceChain?: ChainConfig,
        destinationChain?: ChainConfig,
        gasLimit?: bigint,
    ) {
        this.sourceChain = sourceChain;
        this.destinationChain = destinationChain;
        this.gasLimit = gasLimit ?? BigInt(250000);
    }

    /**
     * Deploys a new ERC20 token on the source chain.
     * @param params - The parameters for deploying the ERC20 token.
     * @param params.walletClient - The wallet client to use for deploying the ERC20 token.
     * @param params.sourceChain - The source chain to deploy the ERC20 token on.
     * @param params.name - The name of the token.
     * @param params.symbol - The symbol of the token.
     * @param params.initialSupply - The initial supply of the token.
     * @param params.recipient - The recipient of the newly minted tokens.
     * @returns The transaction hash and the contract address of the deployed ERC20 token.
     */
    async deployERC20Token(params: DeployERC20TokenParams): Promise<{
        txHash: `0x${string}`,
        contractAddress: `0x${string}`,
    }> {
        const sourceChain = params.sourceChain ?? this.sourceChain;
        if (!sourceChain) {
            throw new Error('Source chain not set.');
        }
        const recipient = params.recipient ?? params.walletClient.account?.address;
        if (!recipient) {
            throw new Error('Recipient not set or not present in wallet client.');
        }
        return deployERC20Token(
            params.walletClient,
            sourceChain,
            params.name,
            params.symbol,
            params.initialSupply,
            recipient,
        );
    }

    /**
     * Approves the token for the token home contract on the source chain.
     * @param params - The parameters for approving the token.
     * @param params.walletClient - The wallet client to use for approving the token.
     * @param params.sourceChain - The source chain to approve the token on.
     * @param params.tokenHomeContract - The address of the token home contract to approve the token for.
     * @param params.tokenAddress - The address of the token to approve.
     * @param params.amountInBaseUnit - The amount of the token to approve.
     * @returns The transaction hash of the approval.
     */
    async approveToken(params: ApproveTokenParams): Promise<{
        txHash: `0x${string}`,
    }> {
        const sourceChain = params.sourceChain ?? this.sourceChain;
        if (!sourceChain) {
            throw new Error('Source chain not set.');
        }
        return approveToken({
            walletClient: params.walletClient,
            chain: sourceChain,
            spenderAddress: params.tokenHomeContract,
            tokenAddress: params.tokenAddress,
            amountInBaseUnit: params.amountInBaseUnit,
        });
    }

    /**
     * Deploy a token home contract on the source chain.
     * @param params - The parameters for deploying the token home contract.
     * @param params.walletClient - The wallet client to use for deploying the token home contract.
     * @param params.sourceChain - The source chain to deploy the token home contract on.
     * @param params.erc20TokenAddress - The address of the ERC20 token to be used as the token home contract.
     * @param params.minimumTeleporterVersion - The minimum teleporter version required for the token home contract.
     * @param params.tokenHomeCustomByteCode - Optional. The customized bytecode for the token home contract.
     * @param params.tokenHomeCustomABI - Optional. The customized ABI for the token home contract.
     * @returns The transaction hash and the contract address of the deployed token home contract.
     */
    async deployTokenHomeContract(params: DeployTokenHomeContractParams): Promise<{
        txHash: `0x${string}`,
        contractAddress: `0x${string}`,
    }> {
        const sourceChain = params.sourceChain ?? this.sourceChain;
        if (!sourceChain) {
            throw new Error('Source chain not set.');
        }
        const publicClient = createPublicClient({
            chain: sourceChain,
            transport: http(),
        });

        const { tokenDecimals } = await getERC20TokenInfo(sourceChain, params.erc20TokenAddress);

        const txHash = await params.walletClient.deployContract({
            abi: params.tokenHomeCustomABI ?? tokenHomeABI.abi,
            bytecode: params.tokenHomeCustomByteCode ?? tokenHomeABI.bytecode as `0x${string}`,
            args: [
                sourceChain.interchainContracts.teleporterRegistry,
                DEFAULT_TELEPORTER_ADDRESS,
                BigInt(params.minimumTeleporterVersion),
                params.erc20TokenAddress,
                tokenDecimals,
            ],
            chain: sourceChain,
            account: params.walletClient.account ?? null,
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        if (receipt.status === 'success' && receipt.contractAddress) {
            return {
                txHash,
                contractAddress: receipt.contractAddress,
            }
        } else {
            throw new Error('Failed to deploy token home contract.', { cause: receipt });
        }
    }

    /**
     * Deploy a token remote contract on the destination chain.
     * @param params - The parameters for deploying the token remote contract.
     * @param params.walletClient - The wallet client to use for deploying the token remote contract.
     * @param params.sourceChain - The source chain to deploy the token remote contract on.
     * @param params.destinationChain - The destination chain to deploy the token remote contract on.
     * @param params.tokenHomeContract - The address of the token home contract to be used as the token remote contract.
     * @param params.tokenRemoteCustomByteCode - Optional. The customized bytecode for the token remote contract.
     * @param params.tokenRemoteCustomABI - Optional. The customized ABI for the token remote contract.
     * @returns The transaction hash and the contract address of the deployed token remote contract.
     */
    async deployTokenRemoteContract(params: DeployTokenRemoteContractParams): Promise<{
        txHash: `0x${string}`,
        contractAddress: `0x${string}`,
    }> {
        const sourceChain = params.sourceChain ?? this.sourceChain;
        if (!sourceChain) {
            throw new Error('Source chain not set.');
        }
        const destinationChain = params.destinationChain ?? this.destinationChain;
        if (!destinationChain) {
            throw new Error('Destination chain not set.');
        }

        const publicClient = createPublicClient({
            chain: destinationChain,
            transport: http(),
        });

        const {
            tokenName,
            tokenSymbol,
            tokenDecimals,
            minTeleporterVersion,
        } = await getInfoFromTokenHomeContract(
            sourceChain,
            params.tokenHomeContract,
        );

        const txHash = await params.walletClient.deployContract({
            abi: params.tokenRemoteCustomABI ?? tokenRemoteABI.abi,
            bytecode: params.tokenRemoteCustomByteCode ?? tokenRemoteABI.bytecode as `0x${string}`,
            args: [
                {
                    teleporterRegistryAddress: destinationChain.interchainContracts.teleporterRegistry,
                    teleporterManager: DEFAULT_TELEPORTER_ADDRESS,
                    minTeleporterVersion: BigInt(minTeleporterVersion),
                    tokenHomeBlockchainID: sourceChain.blockchainId,
                    tokenHomeAddress: params.tokenHomeContract,
                    tokenHomeDecimals: Number(tokenDecimals),
                },
                tokenName,
                tokenSymbol,
                Number(tokenDecimals)
            ],
            chain: destinationChain,
            account: params.walletClient.account ?? null,
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        if (receipt.status === 'success' && receipt.contractAddress) {
            return {
                txHash,
                contractAddress: receipt.contractAddress,
            }
        } else {
            throw new Error('Failed to deploy token remote contract.', { cause: receipt });
        }
    }

    /**
     * Emits event from the TokenRemote contract to get it registered with the TokenHome contract on the source chain.
     * @param params - The parameters for registering the token remote contract with the token home contract.
     * @param params.walletClient - The wallet client to use for registering the token remote contract with the token home contract.
     * @param params.sourceChain - The source chain to register the token remote contract with the token home contract on.
     * @param params.destinationChain - The destination chain to register the token remote contract with the token home contract on.
     * @param params.tokenRemoteContract - The address of the token remote contract to be registered with the token home contract.
     * @param params.feeTokenAddress - Optional. The address of the fee token to be used for the registration.
     * @param params.feeAmount - Optional. The amount of the fee to be used for the registration.
     * @returns The transaction hash of the registration.
     */
    async registerRemoteWithHome(params: RegisterRemoteWithHomeParams): Promise<{
        txHash: `0x${string}`,
    }> {
        const sourceChain = params.sourceChain ?? this.sourceChain;
        if (!sourceChain) {
            throw new Error('Source chain not set.');
        }
        const destinationChain = params.destinationChain ?? this.destinationChain;
        if (!destinationChain) {
            throw new Error('Destination chain not set.');
        }
        const publicClient = createPublicClient({
            chain: destinationChain,
            transport: http(),
        });

        const feeInfo = [
            params.feeTokenAddress ?? '0x0000000000000000000000000000000000000000',
            params.feeAmount ?? 0,
        ];

        const txHash = await params.walletClient.writeContract({
            address: params.tokenRemoteContract,
            abi: tokenRemoteABI.abi,
            functionName: 'registerWithHome',
            args: [feeInfo],
            chain: destinationChain,
            account: params.walletClient.account ?? null,
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        if (receipt.status === 'success') {
            return { txHash };
        } else {
            throw new Error('Failed to register token remote contract with token home contract.', { cause: receipt });
        }
    }

    /**
     * Sends tokens from the TokenHome contract on the source chain to the TokenRemote contract on the destination chain.
     * @param params - The parameters for sending the tokens.
     * @param params.walletClient - The wallet client to use for sending the tokens.
     * @param params.sourceChain - The source chain to send the tokens from.
     * @param params.destinationChain - The destination chain to send the tokens to.
     * @param params.tokenHomeContract - The address of the token home contract to send the tokens from.
     * @param params.tokenRemoteContract - The address of the token remote contract to send the tokens to.
     * @param params.recipient - The address of the recipient of the tokens.
     * @param params.amountInBaseUnit - The amount of the tokens to be sent.
     * @param params.feeTokenAddress - Optional. The address of the fee token to be used for the transfer.
     * @param params.feeAmount - Optional. The amount of the fee to be used for the transfer.
     * @returns The transaction hash of the transfer.
     */
    async sendToken(params: SendTokenParams): Promise<{
        txHash: `0x${string}`,
    }> {
        const sourceChain = params.sourceChain ?? this.sourceChain;
        if (!sourceChain) {
            throw new Error('Source chain not set.');
        }
        const destinationChain = params.destinationChain ?? this.destinationChain;
        if (!destinationChain) {
            throw new Error('Destination chain not set.');
        }
        const publicClient = createPublicClient({
            chain: sourceChain,
            transport: http(),
        });

        const { tokenContractAddress, tokenDecimals } = await getInfoFromTokenHomeContract(
            sourceChain,
            params.tokenHomeContract,
        );
        const amountInWei = BigInt(params.amountInBaseUnit) * BigInt(10 ** tokenDecimals);
        const sendTokensInput = {
            destinationBlockchainID: destinationChain.blockchainId,
            destinationTokenTransferrerAddress: params.tokenRemoteContract,
            recipient: params.recipient,
            primaryFeeTokenAddress: tokenContractAddress ?? '0x0000000000000000000000000000000000000000',
            primaryFee: params.feeAmount ?? 0,
            secondaryFee: 0,
            requiredGasLimit: this.gasLimit,
            multiHopFallback: '0x0000000000000000000000000000000000000000',
        };

        const txHash = await params.walletClient.writeContract({
            address: params.tokenHomeContract,
            abi: tokenHomeABI.abi,
            functionName: 'send',
            args: [sendTokensInput, amountInWei],
            chain: sourceChain,
            account: params.walletClient.account ?? null,
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        if (receipt.status === 'success') {
            return { txHash };
        } else {
            throw new Error('Failed to send tokens.', { cause: receipt });
        }
    }
}

/**
 * Creates a new ICTT client.
 * @param sourceChain - The default source chain to use for the client.
 * @param destinationChain - The default destination chain to use for the client.
 * @param gasLimit - The default gas limit to use for the client.
 * @returns A new ICTT client.
 */
export function createICTTClient(
    sourceChain?: ChainConfig,
    destinationChain?: ChainConfig,
    gasLimit?: bigint,
) {
    return new ICTT(sourceChain, destinationChain, gasLimit);
}
