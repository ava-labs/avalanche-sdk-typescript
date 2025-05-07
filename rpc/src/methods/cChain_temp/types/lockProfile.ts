import { RequestErrorType } from "viem/utils";

export type LockProfileErrorType = RequestErrorType;

export type LockProfileMethod = {
    Method: "admin.lockProfile";
    Parameters: {};
    ReturnType: {};
};