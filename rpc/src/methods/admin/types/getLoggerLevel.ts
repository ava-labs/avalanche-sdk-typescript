import { RequestErrorType } from "viem/utils";

export type GetLoggerLevelParameters = {
    loggerName?: string;
}

export type GetLoggerLevelReturnType = {
    loggerLevels: {
        [loggerName: string]: {
            logLevel: string;
            displayLevel: string;
        }
    }
}

export type GetLoggerLevelErrorType = RequestErrorType;

export type GetLoggerLevelMethod = {
    Method: "admin.getLoggerLevel";
    Parameters: GetLoggerLevelParameters;
    ReturnType: GetLoggerLevelReturnType;
}
