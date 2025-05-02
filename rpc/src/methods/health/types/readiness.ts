import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `health.readiness` method.
 *
 * @property tags - Optional array of tags to filter readiness checks
 */
export type ReadinessParameters = {
  tags?: string[];
};

/**
 * Return type for the `health.readiness` method.
 *
 * @property checks - Object containing readiness check results for each component
 * @property healthy - Overall readiness status of the node
 */
export type ReadinessReturnType = {
  checks: {
    [key: string]: {
      message: {
        timestamp: string;
        duration: number;
        contiguousFailures: number;
        timeOfFirstFailure: string | null;
      };
      healthy: boolean;
    };
  };
  healthy: boolean;
};

export type ReadinessErrorType = RequestErrorType;

export type ReadinessMethod = {
  Method: "health.readiness";
  Parameters: ReadinessParameters;
  ReturnType: ReadinessReturnType;
};
