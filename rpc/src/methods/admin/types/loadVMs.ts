import { RequestErrorType } from "viem/utils";

export type LoadVMsReturnType = {
    newVMs: Map<string, string[]>;
    failedVMs: Map<string, string>;
}

export type LoadVMsErrorType = RequestErrorType;

export type LoadVMsMethod = {
    Method: "admin.loadVMs";
    Parameters: {};
    ReturnType: LoadVMsReturnType;
}
