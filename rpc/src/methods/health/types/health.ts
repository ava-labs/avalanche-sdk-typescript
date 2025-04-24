import { RequestErrorType } from "viem/utils";

export type HealthParameters = {
  tags?: string[];
};

export type HealthReturnType = {
  healthy: boolean;
  checks: {
    C: ChainHealthCheck;
    P: ChainHealthCheck;
    X: ChainHealthCheck;
    bootstrapped: {
      message: any[];
      timestamp: string;
      duration: number;
    };
    database: {
      timestamp: string;
      duration: number;
    };
    diskspace: {
      message: {
        availableDiskBytes: number;
      };
      timestamp: string;
      duration: number;
    };
    network: {
      message: {
        connectedPeers: number;
        sendFailRate: number;
        timeSinceLastMsgReceived: string;
        timeSinceLastMsgSent: string;
      };
      timestamp: string;
      duration: number;
    };
    router: {
      message: {
        longestRunningRequest: string;
        outstandingRequests: number;
      };
      timestamp: string;
      duration: number;
    };
  };
};

type ChainHealthCheck = {
  message: {
    engine: {
      consensus: {
        lastAcceptedHeight: number;
        lastAcceptedID: string;
        longestProcessingBlock: string;
        processingBlocks: number;
      };
      vm: null;
    };
    networking: {
      percentConnected: number;
    };
  };
  timestamp: string;
  duration: number;
};

export type HealthErrorType = RequestErrorType;

export type HealthMethod = {
  Method: "health.health";
  Parameters: HealthParameters;
  ReturnType: HealthReturnType;
};