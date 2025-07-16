
export type DefaultICMParams = {
    feeInfo?: {
        feeTokenAddress: string;
        amount: bigint;
    };
    requiredGasLimit?: bigint;
    allowedRelayerAddresses?: string[];
}