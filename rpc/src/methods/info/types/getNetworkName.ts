import { RequestErrorType } from "viem/utils";

export type GetNetworkNameReturnType = {
    networkName: string;
}

export type GetNetworkNameErrorType = RequestErrorType;

export type GetNetworkNameMethod = {
    Method: "info.getNetworkName";
    Parameters: {};
    ReturnType: GetNetworkNameReturnType;
}