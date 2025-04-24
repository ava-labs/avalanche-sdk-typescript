import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the GetL1Validator method.
 */
export type GetL1ValidatorParameters = {
    /**
     * The ID for L1 subnet validator registration transaction.
     */
    validationID: string;
};

/**
 * Return type for the GetL1Validator method.
 */
export type GetL1ValidatorReturnType = {
    /**
     * The L1 subnet ID this validator is validating.
     */
    subnetID: string;

    /**
     * The node ID of the validator.
     */
    nodeID: string;

    /**
     * The compressed BLS public key of the validator.
     */
    publicKey: string;

    /**
     * Specifies the owner that will receive any withdrawn balance.
     * Includes a locktime, threshold, and an array of addresses.
     */
    remainingBalanceOwner: {
        addresses: string[];
        locktime: string;
        threshold: string;
    };

    /**
     * Specifies the owner that can withdraw the balance.
     * Includes a locktime, threshold, and an array of addresses.
     */
    deactivationOwner: {
        addresses: string[];
        locktime: string;
        threshold: string;
    };

    /**
     * The Unix timestamp, in seconds, of when this validator was added to the validator set.
     */
    startTime: bigint;

    /**
     * The weight of this validator used for consensus voting and ICM.
     */
    weight: bigint;

    /**
     * The minimum nonce that must be included in a SetL1ValidatorWeightTx for the transaction to be valid.
     */
    minNonce?: bigint;

    /**
     * The current remaining balance that can be used to pay for the validator's continuous fee.
     */
    balance?: bigint;

    /**
     * The height of the last accepted block.
     */
    height?: bigint;
};

export type GetL1ValidatorErrorType = RequestErrorType;

export type GetL1ValidatorMethod = {
    Method: "platform.getL1Validator";
    Parameters: GetL1ValidatorParameters;
    ReturnType: GetL1ValidatorReturnType;
};
