import { custom, fallback, http, RpcSchema, Transport, webSocket } from "viem";
import { ipc } from "viem/node";
import { ClientType, TransportConfig } from "./types/types.js";

export function createTransportClient<
  transport extends Transport,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
  transportConfig: TransportConfig<transport, rpcSchema, raw>,
  clientType: ClientType = "public"
): transport {
  switch (transportConfig.type) {
    case "http":
      return http(
        getClientURL(transportConfig.url, clientType),
        transportConfig.config
      ) as transport;
    case "ws":
      return webSocket(
        getClientURL(transportConfig.url, clientType),
        transportConfig.config
      ) as transport;
    case "custom":
      return custom(
        transportConfig.provider,
        transportConfig.config
      ) as transport;
    case "ipc":
      return ipc(transportConfig.path, transportConfig.config) as transport;
    case "fallback":
      return fallback(
        transportConfig.transports,
        transportConfig.config
      ) as transport;
    default:
      throw new Error("Invalid transport type");
  }
}

function getClientURL(
  url?: string,
  clientType: ClientType = "public"
): string | undefined {
  if (!url) {
    throw new Error("URL is required");
  }
  const origin = new URL(url).origin;
  switch (clientType) {
    case "public":
      return url;
    case "pChain":
      return `${origin}/ext/bc/P`;
    case "xChain":
      return `${origin}/ext/bc/X`;
    case "cChain":
      return `${origin}/ext/bc/C/rpc`;
    case "cChainAdmin":
      return `${origin}/ext/bc/C/admin`;
    default:
      throw new Error("Invalid client type");
  }
}
