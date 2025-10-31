import { RequestErrorType } from "viem/utils";

/**
 * Return type for the proposervm.getProposedHeight method.
 * @property height - This node's current proposer VM height
 */
export type GetProposedHeightReturnType = {
  height: string;
};

export type GetProposedHeightErrorType = RequestErrorType;

export type GetProposedHeightMethod = {
  Method: "proposervm.getProposedHeight";
  Parameters: {};
  ReturnType: GetProposedHeightReturnType;
};
