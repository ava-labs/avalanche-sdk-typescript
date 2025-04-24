import { RequestErrorType } from "viem/utils";

export type GetValidatorsAtParameters = {
    height: number;
    subnetID?: string;
}
  
export type GetValidatorsAtReturnType = {
    validators: Record<string, number>;
}

export type GetValidatorsAtErrorType = RequestErrorType;

export type GetValidatorsAtMethod = {
    Method: "platform.getValidatorsAt";
    Parameters: GetValidatorsAtParameters;
    ReturnType: GetValidatorsAtReturnType;
};