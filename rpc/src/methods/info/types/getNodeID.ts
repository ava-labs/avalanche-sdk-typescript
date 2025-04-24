import { RequestErrorType } from "viem/utils";

export type GetNodeIDReturnType = {
    nodeID: string;
    nodePOP: {
        publicKey: string;
        proofOfPossession: string;
    };
}

export type GetNodeIDErrorType = RequestErrorType;

export type GetNodeIDMethod = {
    Method: "info.getNodeID";
    Parameters: {};
    ReturnType: GetNodeIDReturnType;
}