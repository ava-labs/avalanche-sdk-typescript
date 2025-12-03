import { RequestErrorType } from "../../../utils";

/**
 * Parameters for the public.getRegistrationJustification method.
 * @property validationID - The hexadecimal representation or the base58check encoded string of the validation ID.
 * @property subnetIDStr - The string representation of the subnet ID.
 * @property fromBlock - The block number to start searching from.
 * @property toBlock - The block number to stop searching at. Default is`"latest"`.
 * @property searchOrder - The order to search in. Default is `desc`. Searches from `toBlock` to `fromBlock`.
 * @property chunkSize - The number of blocks to search in each chunk. Default is 2000.
 * @property maxChunks - The maximum number of chunks to search. Default is 100.
 * @property maxBootstrapValidators - The number of bootstrap validators to search. Default is 100.
 */
export type GetRegistrationJustificationParams = {
  validationID: string;
  subnetIDStr: string;
  startBlock?: number | bigint | "latest";
  chunkSize?: number;
  maxChunks?: number;
  maxBootstrapValidators?: number;
  searchOrder?: "asc" | "desc";
};

/**
 * Return type for the public.getRegistrationJustification method.
 * @property justification - The justification for the registration.
 */
export type GetRegistrationJustificationReturnType = {
  justification: Uint8Array | null;
  error?: string;
};

export type GetRegistrationJustificationErrorType = RequestErrorType;
