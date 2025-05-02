import { RequestErrorType } from "viem/utils";

/**
 * Return type for the `platform.getProposedHeight` method.
 * Get the proposed height of the P-Chain.
 * @property height - The proposed height of the P-Chain
 */
export type GetProposedHeightReturnType = {
  height: number;
};

export type GetProposedHeightErrorType = RequestErrorType;

export type GetProposedHeightMethod = {
  Method: "platform.getProposedHeight";
  Parameters: {};
  ReturnType: GetProposedHeightReturnType;
};
