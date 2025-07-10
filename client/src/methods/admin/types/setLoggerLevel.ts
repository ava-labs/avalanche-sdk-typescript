import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `admin.setLoggerLevel` method.
 *
 * @property loggerName - The name of the logger to set levels for
 * @property logLevel - The log level to set (e.g. "DEBUG", "INFO", "WARN", "ERROR")
 * @property displayLevel - The display level to set (e.g. "DEBUG", "INFO", "WARN", "ERROR")
 */
export type SetLoggerLevelParameters = {
  loggerName: string;
  logLevel: string;
  displayLevel: string;
};

export type SetLoggerLevelErrorType = RequestErrorType;

export type SetLoggerLevelMethod = {
  Method: "admin.setLoggerLevel";
  Parameters: SetLoggerLevelParameters;
  ReturnType: {};
};
