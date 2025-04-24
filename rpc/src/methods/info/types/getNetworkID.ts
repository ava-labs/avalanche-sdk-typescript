import { RequestErrorType } from "viem/utils";

export type GetNetworkIDReturnType = {
    networkID: number;
}

export type GetNetworkIDErrorType = RequestErrorType;

export type GetNetworkIDMethod = {
    Method: "info.getNetworkID";
    Parameters: {};
    ReturnType: GetNetworkIDReturnType;
}
