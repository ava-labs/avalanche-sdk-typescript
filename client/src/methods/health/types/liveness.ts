import { RequestErrorType } from "viem/utils";

/**
 * Return type for the `health.liveness` method.
 *
 * @property healthy - Indicates if the node is alive and can handle requests
 */
export type LivenessReturnType = {
  checks: object;
  healthy: boolean;
};

export type LivenessErrorType = RequestErrorType;

export type LivenessMethod = {
  Method: "health.liveness";
  Parameters: {};
  ReturnType: LivenessReturnType;
};
