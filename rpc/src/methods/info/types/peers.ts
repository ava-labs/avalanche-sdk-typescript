import { RequestErrorType } from "viem/utils";

export type PeersParameters = {
    nodeIDs?: string[];
}

export type PeersReturnType = {
    numPeers: number;
    peers: {
        ip: string;
        publicIP: string;
        nodeID: string;
        version: string;
        lastSent: string;
        lastReceived: string;
        benched: string[];
        observedUptime: number;
    }[];
}   

export type PeersErrorType = RequestErrorType;

export type PeersMethod = {
    Method: "info.peers";
    Parameters: PeersParameters;
    ReturnType: PeersReturnType;
}