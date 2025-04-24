import { RequestErrorType } from "viem/utils";

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
    fortunaTime: string;
}

export type UpgradesErrorType = RequestErrorType;

export type UpgradesMethod = {
    Method: "info.upgrades";
    Parameters: {};
    ReturnType: UpgradesReturnType;
}