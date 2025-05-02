import { RequestErrorType } from "viem/utils";

export type StartCPUProfilerErrorType = RequestErrorType;

export type StartCPUProfilerMethod = {
  Method: "admin.startCPUProfiler";
  Parameters: {};
  ReturnType: {};
};
