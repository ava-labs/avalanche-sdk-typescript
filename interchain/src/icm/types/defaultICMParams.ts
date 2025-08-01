/**
 * Default parameters for ICM client
 * 
 * These parameters define the default configuration for cross-chain messaging
 * using the Teleporter protocol. These params can be overridden in the client's
 * sendMsg() call.
*/
export type DefaultICMParams = {
    /**
     * Default fee information rewarded to the relayer
     * of this message
    */
    feeInfo?: {
        feeTokenAddress: string;
        amount: bigint;
    };
    /**
     * Default gas limit for message execution
    */
    requiredGasLimit?: bigint;
    /**
     * Default list of allowed relayer addresses
    */
    allowedRelayerAddresses?: string[];
}