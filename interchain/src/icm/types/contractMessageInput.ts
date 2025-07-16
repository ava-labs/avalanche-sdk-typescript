export type TeleporterMessageInput = {
    destinationBlockchainID: string;
    destinationAddress: string;
    feeInfo: {
        feeTokenAddress: string;
        amount: bigint;
    };
    requiredGasLimit: bigint;
    allowedRelayerAddresses: string[];
    message: string;
};