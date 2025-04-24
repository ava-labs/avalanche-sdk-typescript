import { RequestErrorType } from "viem/utils";

export type LivenessReturnType = {
    checks: object;
    healthy: boolean;
}

export type LivenessErrorType = RequestErrorType;

export type LivenessMethod = {
    Method: "health.liveness";
    Parameters: {};
    ReturnType: LivenessReturnType;
}
