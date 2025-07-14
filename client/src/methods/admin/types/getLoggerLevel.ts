import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the admin.getLoggerLevel method.
 *
 * @property loggerName - The name of the logger to get levels for
 */
export type GetLoggerLevelParameters = {
  loggerName?: string;
};

/**
 * Return type for the `admin.getLoggerLevel` method.
 *
 * @property loggerLevels - An object containing the log and display levels for each logger
 */
export type GetLoggerLevelReturnType = {
  loggerLevels: {
    [loggerName: string]: {
      /**
       * The current log level of the logger
       */
      logLevel: string;
      /**
       * The current display level of the logger
       */
      displayLevel: string;
    };
  };
};

export type GetLoggerLevelErrorType = RequestErrorType;

export type GetLoggerLevelMethod = {
  Method: "admin.getLoggerLevel";
  Parameters: GetLoggerLevelParameters;
  ReturnType: GetLoggerLevelReturnType;
};
