import {
  CustomTransportConfig,
  FallbackTransportConfig,
  HttpTransportConfig,
  RpcSchema,
  Transport,
  WebSocketTransportConfig,
} from "viem";
import { IpcTransportConfig } from "viem/node";

export type AvalancheTransportConfig<
  transport extends Transport,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
> =
  | {
      type: "http";
      url?: string;
      config?: HttpTransportConfig<rpcSchema, raw>;
    }
  | {
      type: "ws";
      url?: string;
      config?: WebSocketTransportConfig;
    }
  | {
      type: "custom";
      provider: any;
      config?: CustomTransportConfig;
    }
  | {
      type: "ipc";
      path: string;
      config?: IpcTransportConfig;
    }
  | {
      type: "fallback";
      transports: transport[];
      config?: FallbackTransportConfig;
    };

export type ClientType =
  | "pChain"
  | "cChain"
  | "xChain"
  | "public"
  | "admin"
  | "info"
  | "indexPChainBlock"
  | "indexCChainBlock"
  | "indexXChainBlock"
  | "indexXChainTx"
  | "health"
  | "proposervmCChain"
  | "proposervmPChain"
  | "proposervmXChain"
  | "wallet";
