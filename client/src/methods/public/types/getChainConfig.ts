import { RequestErrorType } from "viem/utils";

export type GetChainConfigReturnType = {
  chainId: number;
  homesteadBlock: number;
  daoForkBlock: number;
  daoForkSupport: boolean;
  eip150Block: number;
  eip150Hash: string;
  eip155Block: number;
  eip158Block: number;
  byzantiumBlock: number;
  constantinopleBlock: number;
  petersburgBlock: number;
  istanbulBlock: number;
  muirGlacierBlock: number;
  apricotPhase1BlockTimestamp: number;
  apricotPhase2BlockTimestamp: number;
  apricotPhase3BlockTimestamp: number;
  apricotPhase4BlockTimestamp: number;
  apricotPhase5BlockTimestamp: number;
};

export type GetChainConfigErrorType = RequestErrorType;

export type GetChainConfigMethod = {
  Method: "eth_getChainConfig";
  Parameters: [];
  ReturnType: GetChainConfigReturnType;
};
