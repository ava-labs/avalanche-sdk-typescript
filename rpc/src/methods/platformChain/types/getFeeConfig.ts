import { RequestErrorType } from "viem/utils";

/**
 * Represents the configuration for fees on the platform chain.
 * This type defines the structure of the return value for the `getFeeConfig` method.
 */
export type GetFeeConfigReturnType = {
    /**
     * Weights to merge fee dimensions into a single gas value.
     * Each dimension represents a specific resource cost:
     * - `bandwidth`: The weight for bandwidth usage.
     * - `dbRead`: The weight for database read operations.
     * - `dbWrite`: The weight for database write operations.
     * - `compute`: The weight for computational operations.
     */
    weights: [
        bandwidth: number,
        dbRead: number,
        dbWrite: number,
        compute: number,
    ];

    /**
     * The maximum amount of gas the chain is allowed to store for future use.
     * This value ensures that the chain does not exceed its storage capacity.
     */
    maxCapacity: bigint;

    /**
     * The maximum amount of gas the chain is allowed to consume per second.
     * This value acts as a cap on the gas consumption rate.
     */
    maxPerSecond: bigint;

    /**
     * The target amount of gas the chain should consume per second to maintain
     * stable fees. This value helps regulate gas usage and fee stability.
     */
    targetPerSecond: bigint;

    /**
     * The minimum price per unit of gas. This value ensures that gas prices
     * do not fall below a certain threshold.
     */
    minPrice: bigint;

    /**
     * A constant used to convert excess gas into a gas price. This value
     * helps determine the relationship between excess gas and its impact
     * on gas pricing.
     */
    excessConversionConstant: bigint;
};

export type GetFeeConfigErrorType = RequestErrorType;

export type GetFeeConfigMethod = {
    Method: "platform.getFeeConfig";
    Parameters: {};
    ReturnType: GetFeeConfigReturnType;
};