import { type WalletClient, encodeAbiParameters, parseAbiParameters } from 'viem';
import { teleporterABI } from '../abis/teleporterABI';
import { ChainConfig } from './types/chainConfig';
import { SendMessageArgs } from './types/sendMsgArgs';
import { DefaultICMParams } from './types/defaultICMParams';
import { DEFAULT_TELEPORTER_ADDRESS } from './consts';
import { TeleporterMessageInput } from './types/contractMessageInput';

export class ICM {
    teleporterAddress: `0x${string}`;
    wallet: WalletClient;

    // Default hoisted values
    defaultRecipient: '0x0000000000000000000000000000000000000000';
    sourceChain?: ChainConfig;
    destinationChain?: ChainConfig;
    feeInfo = {
        feeTokenAddress: '0x0000000000000000000000000000000000000000',
        amount: 0n
    }
    requiredGasLimit = 100000n;
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

    async sendMsg(params: SendMessageArgs) {
        const encodedMessage: string = encodeAbiParameters(
            parseAbiParameters('string'), 
            [params.message]
        );

        const messageInput: TeleporterMessageInput = {
            destinationBlockchainID: params.destinationChain.blockchainId,
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
            chain: params.sourceChain,
            account: this.wallet.account ?? null,
        });

        return hash;
    }
}

export function createICMClient(
    wallet: WalletClient,
    sourceChain?: ChainConfig,
    destinationChain?: ChainConfig,
    defaultParams?: DefaultICMParams
): ICM {
    return new ICM(wallet, sourceChain, destinationChain, defaultParams);
}
