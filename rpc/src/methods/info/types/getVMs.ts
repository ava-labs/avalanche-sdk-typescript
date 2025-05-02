import { RequestErrorType } from "viem/utils";

/**
 * Return type for the info.getVMs method.
 * @property vms - Map of VM IDs to their aliases
 */
export type GetVMsReturnType = {
  vms: {
    [key: string]: string[];
  };
};

export type GetVMsErrorType = RequestErrorType;

export type GetVMsMethod = {
  Method: "info.getVMs";
  Parameters: {};
  ReturnType: GetVMsReturnType;
};
