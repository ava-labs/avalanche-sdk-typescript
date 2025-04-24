import { RequestErrorType } from "viem/utils";

export type GetNodeVersionReturnType = {
    version: string;
    databaseVersion: string;
    gitCommit: string;
    vmVersions: Map<string, string>;
    rpcProtocolVersion: string;
}

export type GetNodeVersionErrorType = RequestErrorType;

export type GetNodeVersionMethod = {
    Method: "info.getNodeVersion";
    Parameters: {};
    ReturnType: GetNodeVersionReturnType;
}
