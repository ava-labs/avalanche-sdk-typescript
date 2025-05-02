import { RequestErrorType } from "viem/utils";

/**
 * Return type for the `admin.loadVMs` method.
 *
 * @property newVMs - Object containing the newly loaded VMs
 * @property failedVMs - Object containing any VMs that failed to load
 */
export type LoadVMsReturnType = {
  newVMs: {
    [vmID: string]: string[];
  };
  failedVMs: {
    [vmID: string]: string;
  };
};

export type LoadVMsErrorType = RequestErrorType;

export type LoadVMsMethod = {
  Method: "admin.loadVMs";
  Parameters: {};
  ReturnType: LoadVMsReturnType;
};
