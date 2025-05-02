import { RequestErrorType } from "viem/utils";

/**
 * Return type for the `platform.getHeight` method.
 * Get the current height of the P-Chain.
 * @property height - The current height of the P-Chain
 */
export type GetHeightReturnType = {
  height: number;
};

export type GetHeightErrorType = RequestErrorType;

export type GetHeightMethod = {
  Method: "platform.getHeight";
  Parameters: {};
  ReturnType: GetHeightReturnType;
};
