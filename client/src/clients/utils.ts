import {
  Chain,
  custom,
  fallback,
  http,
  RpcSchema,
  Transport,
  webSocket,
} from "viem";
import { commonHeaders } from "./common.js";
import { AvalancheTransportConfig, ClientType } from "./types/types.js";
import { AVALANCHE_CHAIN_IDS } from "../methods/consts.js";

const AVALANCHE_CHAIN_ID_VALUES = Object.values(AVALANCHE_CHAIN_IDS) as number[];

export function createAvalancheTransportClient<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  raw extends boolean = false
>(
  transportConfig: AvalancheTransportConfig<transport, rpcSchema, raw>,
  chain?: chain | Chain | undefined,
  {
    apiKey,
    rlToken,
  }: { apiKey?: string | undefined; rlToken?: string | undefined } = {},
  clientType: ClientType = "public"
): transport {
  switch (transportConfig.type) {
    case "http":
      return http(
        getClientURL(chain, transportConfig.url, clientType, "http"),
        {
          ...transportConfig.config,
          fetchOptions: {
            ...(transportConfig.config?.fetchOptions ?? {}),
            ...(apiKey
              ? {
                  headers: {
                    ...transportConfig.config?.fetchOptions?.headers,
                    "x-glacier-api-key": apiKey,
                    ...commonHeaders,
                  },
                }
              : rlToken
              ? {
                  headers: {
                    ...transportConfig.config?.fetchOptions?.headers,
                    rlToken: rlToken,
                    ...commonHeaders,
                  },
                }
              : {}),
          },
        }
      ) as transport;
    case "ws":
      return webSocket(
        getClientURL(chain, transportConfig.url, clientType, "webSocket"),
        transportConfig.config
      ) as transport;
    case "custom":
      if (clientType !== "wallet") {
        return http(getClientURL(chain, undefined, clientType, "http"), {
          ...transportConfig.config,
          fetchOptions: {
            ...(apiKey
              ? { headers: { "x-glacier-api-key": apiKey, ...commonHeaders } }
              : rlToken
              ? { headers: { rlToken: rlToken, ...commonHeaders } }
              : { headers: commonHeaders }),
          },
        }) as transport;
      }
      return custom(
        transportConfig.provider,
        transportConfig.config
      ) as transport;
    case "ipc":
      throw new Error(
        "IPC transport is not available in browser environments. Use HTTP or WebSocket transport instead."
      );
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
  chain?: Chain,
  url?: string,
  clientType: ClientType = "public",
  transportType: "http" | "webSocket" = "http"
): string | undefined {
  if (!chain?.id || !AVALANCHE_CHAIN_ID_VALUES.includes(chain.id)) {
    return url ?? chain?.rpcUrls.default[transportType]?.[0];
  }

  if (!url && !chain?.rpcUrls?.default?.[transportType]?.[0]) {
    throw new Error("URL is required");
  }

  url = url ?? chain.rpcUrls.default[transportType]?.[0];

  const origin = new URL(url!).origin;
  switch (clientType) {
    case "public":
      return url;
    case "wallet":
      return url;
    case "pChain":
      return `${origin}/ext/bc/P`;
    case "xChain":
      return `${origin}/ext/bc/X`;
    case "cChain":
      return `${origin}/ext/bc/C/avax`;
    case "admin":
      return `${origin}/ext/admin`;
    case "info":
      return `${origin}/ext/info`;
    case "health":
      return `${origin}/ext/health`;
    case "indexPChainBlock":
      return `${origin}/ext/index/P/block`;
    case "indexCChainBlock":
      return `${origin}/ext/index/C/block`;
    case "indexXChainBlock":
      return `${origin}/ext/index/X/block`;
    case "indexXChainTx":
      return `${origin}/ext/index/X/tx`;
    case "proposervmCChain":
      return `${origin}/ext/bc/C/proposervm`;
    case "proposervmPChain":
      return `${origin}/ext/bc/P/proposervm`;
    case "proposervmXChain":
      return `${origin}/ext/bc/X/proposervm`;
    default:
      throw new Error(`Invalid client type` + clientType);
  }
}
