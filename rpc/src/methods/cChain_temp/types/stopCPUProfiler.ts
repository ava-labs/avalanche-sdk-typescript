import { RequestErrorType } from "viem/utils";

export type StopCPUProfilerErrorType = RequestErrorType;

export type StopCPUProfilerMethod = {
    Method: "admin.stopCPUProfiler";
    Parameters: {};
    ReturnType: {};
};