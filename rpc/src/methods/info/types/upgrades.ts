import { RequestErrorType } from "viem/utils";

/**
 * Return type for the info.upgrades method.
 * @property apricotPhase1Time - Timestamp of Apricot Phase 1 upgrade
 * @property apricotPhase2Time - Timestamp of Apricot Phase 2 upgrade
 * @property apricotPhase3Time - Timestamp of Apricot Phase 3 upgrade
 * @property apricotPhase4Time - Timestamp of Apricot Phase 4 upgrade
 * @property apricotPhase4MinPChainHeight - Minimum P-Chain height for Apricot Phase 4
 * @property apricotPhase5Time - Timestamp of Apricot Phase 5 upgrade
 * @property apricotPhasePre6Time - Timestamp of Apricot Phase Pre-6 upgrade
 * @property apricotPhase6Time - Timestamp of Apricot Phase 6 upgrade
 * @property apricotPhasePost6Time - Timestamp of Apricot Phase Post-6 upgrade
 * @property banffTime - Timestamp of Banff upgrade
 * @property cortinaTime - Timestamp of Cortina upgrade
 * @property cortinaXChainStopVertexID - X-Chain stop vertex ID for Cortina upgrade
 * @property durangoTime - Timestamp of Durango upgrade
 * @property etnaTime - Timestamp of Etna upgrade
 * @property fortunaTime - Timestamp of Fortuna upgrade
 */
export type UpgradesReturnType = {
  apricotPhase1Time: string;
  apricotPhase2Time: string;
  apricotPhase3Time: string;
  apricotPhase4Time: string;
  apricotPhase4MinPChainHeight: number;
  apricotPhase5Time: string;
  apricotPhasePre6Time: string;
  apricotPhase6Time: string;
  apricotPhasePost6Time: string;
  banffTime: string;
  cortinaTime: string;
  cortinaXChainStopVertexID: string;
  durangoTime: string;
  etnaTime: string;
  fortunaTime?: string;
};

export type UpgradesErrorType = RequestErrorType;

export type UpgradesMethod = {
  Method: "info.upgrades";
  Parameters: {};
  ReturnType: UpgradesReturnType;
};
