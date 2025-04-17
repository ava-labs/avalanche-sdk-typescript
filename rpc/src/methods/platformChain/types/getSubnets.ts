import { RequestErrorType } from "viem/utils";

export type GetSubnetsParameters = {
  ids: string[];
};

export type GetSubnetsReturnType = {
  subnets: {
    id: string;
    controlKeys: string[];
    threshold: string;
  }[];
};

export type GetSubnetsErrorType = RequestErrorType;

export type GetSubnetsMethod = {
  Method: "platform.getSubnets";
  Parameters: GetSubnetsParameters;
  ReturnType: GetSubnetsReturnType;
};
