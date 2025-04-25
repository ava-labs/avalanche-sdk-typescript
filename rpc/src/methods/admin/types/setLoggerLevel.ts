import { RequestErrorType } from "viem/utils";

export type SetLoggerLevelParameters = {
    level: string;
}

export type SetLoggerLevelErrorType = RequestErrorType;

export type SetLoggerLevelMethod = {
    Method: "admin.setLoggerLevel";
    Parameters: SetLoggerLevelParameters;
    ReturnType: {};
};