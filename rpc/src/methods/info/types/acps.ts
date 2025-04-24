import { RequestErrorType } from "viem/utils";

export type AcpsReturnType = {
    acps: Map<number, {
        supportWeight: bigint;
        supporters: Set<string>;
        objectWeight: bigint;
        objectors: Set<string>;
        abstainWeight: bigint;
    }>;
}

export type AcpsErrorType = RequestErrorType;

export type AcpsMethod = {
    Method: "info.acps";
    Parameters: {};
    ReturnType: AcpsReturnType;
}
