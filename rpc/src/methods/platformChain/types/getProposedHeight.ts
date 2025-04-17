import { RequestErrorType } from "viem/utils";


export type GetProposedHeightReturnType = {
    height: number;
};

export type GetProposedHeightErrorType = RequestErrorType;

export type GetProposedHeightMethod = {
    Method: "platform.getProposedHeight";
    Parameters: {};
    ReturnType: GetProposedHeightReturnType;
};