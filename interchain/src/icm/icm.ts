import { WalletClient, encodeAbiParameters, parseAbiParameters } from 'viem';
import { teleporterABI } from '../abis/teleporterABI';
import { ChainConfig } from '../chains/types/chainConfig';
import { SendMessageArgs } from './types/sendMsgArgs';
import { DefaultICMParams } from './types/defaultICMParams';
import { DEFAULT_TELEPORTER_ADDRESS } from './consts';
import { TeleporterMessageInput } from './types/contractMessageInput';

/**
 * Inter-Chain Messaging (ICM) client for sending cross-chain messages via Teleporter protocol.
 * 
 * This class provides functionality to send messages between different blockchains
 * using the Teleporter bridge protocol. It handles message encoding, fee management,
 * and contract interactions.
*/
export class ICM {
    /** The Teleporter contract address for cross-chain messaging */
    teleporterAddress: `0x${string}`;
    
    /** The viem's wallet client for signing and sending transactions */
    wallet: WalletClient;

    /** Default recipient address when none is specified (zero address) */
    defaultRecipient: '0x0000000000000000000000000000000000000000';
    
    /** Source blockchain configuration */
    sourceChain: ChainConfig | undefined;
    
    /** Destination blockchain configuration */
    destinationChain: ChainConfig | undefined;
    
    /** Default fee information for cross-chain messages */
    feeInfo = {
        feeTokenAddress: '0x0000000000000000000000000000000000000000',
        amount: 0n
    }
    
    /** Default gas limit required for message execution on destination chain */
    requiredGasLimit = 100000n;
    
    /** List of allowed relayer addresses for message delivery */
    allowedRelayerAddresses: string[] = [];

    constructor(
        wallet: WalletClient,
        sourceChain?: ChainConfig,
        destinationChain?: ChainConfig,
        defaultParams?: DefaultICMParams
    ) {
        this.wallet = wallet;
        this.sourceChain = sourceChain;
        this.destinationChain = destinationChain;
        this.defaultRecipient = '0x0000000000000000000000000000000000000000';
        this.feeInfo = defaultParams?.feeInfo || this.feeInfo;
        this.requiredGasLimit = defaultParams?.requiredGasLimit || this.requiredGasLimit;
        this.allowedRelayerAddresses = defaultParams?.allowedRelayerAddresses || this.allowedRelayerAddresses;
        this.teleporterAddress = DEFAULT_TELEPORTER_ADDRESS;
    }

    /**
     * Sends a cross-chain message to the specified destination blockchain.
     * 
     * This method encodes the message, constructs the Teleporter message input,
     * and submits the transaction to the Teleporter contract on the source chain.
     * 
     * @param params - Parameters for sending the cross-chain message
     * @param params.message - The message content to send (will be encoded as string)
     * @param params.sourceChain - Source blockchain configuration (required if not set in constructor)
     * @param params.destinationChain - Destination blockchain configuration (required if not set in constructor)
     * @param params.recipientAddress - Optional recipient address on destination chain (defaults to zero address)
     * @param params.feeInfo - Optional fee information (overrides default if provided)
     * @param params.requiredGasLimit - Optional gas limit (overrides default if provided)
     * @param params.allowedRelayerAddresses - Optional relayer addresses (overrides default if provided)
     * 
     * @returns Promise<string> - The transaction hash of the submitted cross-chain message
     */
    async sendMsg(params: SendMessageArgs) {
        const encodedMessage: string = encodeAbiParameters(
            parseAbiParameters('string'), 
            [params.message]
        );

        const sourceChain = params.sourceChain ?? this.sourceChain;
        const destinationChain = params.destinationChain ?? this.destinationChain;

        if (!sourceChain || !destinationChain) {
            throw new Error('Source or destination chain not set or not provided in the params');
        }

        const messageInput: TeleporterMessageInput = {
            destinationBlockchainID: sourceChain.blockchainId,
            destinationAddress: params.recipientAddress || this.defaultRecipient,
            feeInfo: params.feeInfo || this.feeInfo,
            requiredGasLimit: params.requiredGasLimit || this.requiredGasLimit,
            allowedRelayerAddresses: params.allowedRelayerAddresses || this.allowedRelayerAddresses,
            message: encodedMessage
        };

        const hash: string = await this.wallet.writeContract({
            address: this.teleporterAddress,
            abi: teleporterABI,
            functionName: 'sendCrossChainMessage',
            args: [messageInput],
            chain: sourceChain,
            account: this.wallet.account ?? null,
        });

        return hash;
    }
}

/**
 * Creates a new ICM client instance.
 * 
 * @param wallet - The Viem's wallet client for signing and sending transactions
 * @param sourceChain - Optional source blockchain configuration. If not provided, must be specified in sendMsg calls
 * @param destinationChain - Optional destination blockchain configuration. If not provided, must be specified in sendMsg calls
 * @param defaultParams - Optional default parameters for cross-chain messaging
 * @param defaultParams.feeInfo - Default fee information (token address and amount)
 * @param defaultParams.requiredGasLimit - Default gas limit for message execution
 * @param defaultParams.allowedRelayerAddresses - Default list of allowed relayer addresses
 */
export function createICMClient(
    wallet: WalletClient,
    sourceChain?: ChainConfig,
    destinationChain?: ChainConfig,
    defaultParams?: DefaultICMParams
): ICM {
    return new ICM(wallet, sourceChain, destinationChain, defaultParams);
}
