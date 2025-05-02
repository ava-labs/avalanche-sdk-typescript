import { RequestErrorType } from "viem/utils";

export type MemoryProfileErrorType = RequestErrorType;

export type MemoryProfileMethod = {
  Method: "admin.memoryProfile";
  Parameters: {};
  ReturnType: {};
};
