import { RequestErrorType } from "viem/utils";

/**
 * The parameters for the `feeConfig` method.
 *
 * @property blk - The block number or hash at which to retrieve the fee config. Defaults to the latest block if omitted.
 */
export type FeeConfigParameters = {
  blk: string;
};

/**
 * The return type for the `feeConfig` method.
 *
 * @property feeConfig - An object containing the fee config for each chain.
 * @property lastChangedAt - The timestamp of the last fee config change.
 */
export type FeeConfigReturnType = {
  feeConfig: {
    [key: string]: string;
  };
  lastChangedAt: string;
};

export type FeeConfigErrorType = RequestErrorType;

export type FeeConfigMethod = {
  Method: "eth_feeConfig";
  Parameters: [FeeConfigParameters];
  ReturnType: FeeConfigReturnType;
};
