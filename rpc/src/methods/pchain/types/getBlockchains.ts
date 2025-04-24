import { RequestErrorType } from "viem/utils";

export type GetBlockchainsReturnType = {
  blockchains: {
    id: string;
    name: string;
    subnetID: string;
    vmID: string;
  }[];
};

export type GetBlockchainsErrorType = RequestErrorType;

export type GetBlockchainsMethod = {
  Method: "platform.getBlockchains";
  Parameters: {};
  ReturnType: GetBlockchainsReturnType;
};
