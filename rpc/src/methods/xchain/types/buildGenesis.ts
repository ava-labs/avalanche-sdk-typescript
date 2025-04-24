import { RequestErrorType } from "viem/utils";

export type BuildGenesisParameters = {
    genesisData: object;
    networkId?: number;
    encoding?: "hex";
}

export type BuildGenesisReturnType = {
    bytes: string;
    encoding: string;
}

export type BuildGenesisErrorType = RequestErrorType;

export type BuildGenesisMethod = {
  Method: "avm.buildGenesis";
  Parameters: BuildGenesisParameters;
  ReturnType: BuildGenesisReturnType;
};