import { RequestErrorType } from "viem/utils";

export type GetHeightReturnType = {
    height: number;
}

export type GetHeightErrorType = RequestErrorType;

export type GetHeightMethod = {
    Method: "avm.getHeight";
    Parameters: {};
    ReturnType: GetHeightReturnType;
}