import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the info.acps method.
 */
export type AcpsParameters = Record<string, never>;

/**
 * Return type for the info.acps method.
 * @property acps - Map of ACP IDs to their peer preferences
 */
export type AcpsReturnType = {
  acps: Map<
    number,
    {
      // The weight of stake supporting the ACP
      supportWeight: bigint;
      // The set of node IDs supporting the ACP
      supporters: Set<string>;
      // The weight of stake objecting to the ACP
      objectWeight: bigint;
      // The set of node IDs objecting to the ACP
      objectors: Set<string>;
      // The weight of stake abstaining from the ACP
      abstainWeight: bigint;
    }
  >;
};

export type AcpsErrorType = RequestErrorType;

export type AcpsMethod = {
  Method: "info.acps";
  Parameters: {};
  ReturnType: AcpsReturnType;
};
