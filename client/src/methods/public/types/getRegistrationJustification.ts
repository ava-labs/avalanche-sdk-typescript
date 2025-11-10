import { RequestErrorType } from "src/utils";

/**
 * Parameters for the public.getRegistrationJustification method.
 * @property validationIDHex - The hexadecimal representation of the validation ID.
 * @property subnetIDStr - The string representation of the subnet ID.
 */
export type GetRegistrationJustificationParams = {
  validationIDHex: string;
  subnetIDStr: string;
};

/**
 * Return type for the public.getRegistrationJustification method.
 * @property justification - The justification for the registration.
 */
export type GetRegistrationJustificationReturnType = {
  justification: Uint8Array | null;
};

export type GetRegistrationJustificationErrorType = RequestErrorType;
