import { RequestErrorType } from "viem/utils";

export type GetVMsReturnType = {
    vms: Map<string, string[]>;
}

export type GetVMsErrorType = RequestErrorType;

export type GetVMsMethod = {
    Method: "info.getVMs";
    Parameters: {};
    ReturnType: GetVMsReturnType;
}
