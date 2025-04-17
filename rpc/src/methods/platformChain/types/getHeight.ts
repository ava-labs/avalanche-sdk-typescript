import { RequestErrorType } from "viem/utils";

export type GetHeightReturnType = {
    height: number;
};

export type GetHeightErrorType = RequestErrorType;

export type GetHeightMethod = {
    Method: "platform.getHeight";
    Parameters: {};
    ReturnType: GetHeightReturnType;
};