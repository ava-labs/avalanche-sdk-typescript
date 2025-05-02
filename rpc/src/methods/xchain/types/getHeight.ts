import { RequestErrorType } from "viem/utils";

/**
 * The return type for the `avm.getHeight` method.
 *
 * @property height - The height of the block.
 */
export type GetHeightReturnType = {
  height: number;
};

export type GetHeightErrorType = RequestErrorType;

export type GetHeightMethod = {
  Method: "avm.getHeight";
  Parameters: {};
  ReturnType: GetHeightReturnType;
};
