import { RequestErrorType } from "viem/utils";

export type ReadinessParameters = {
  tags?: string[];
};

export type ReadinessReturnType = {
  checks: object;
  healthy: boolean;
};

export type ReadinessErrorType = RequestErrorType;

export type ReadinessMethod = {
  Method: "health.readiness";
  Parameters: ReadinessParameters;
  ReturnType: ReadinessReturnType;
};
