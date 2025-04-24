import { IssueTxReturnType } from "./types/issueTx.js";

import { Transport, Chain } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";
import { IssueTxParameters } from "./types/issueTx.js";

export async function issueTx<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: IssueTxParameters
): Promise<IssueTxReturnType> {
  return client.request<
    CChainRpcSchema,
    {
      method: "avax.issueTx";
      params: IssueTxParameters;
    },
    IssueTxReturnType
  >({
    method: "avax.issueTx",
    params,
  });
}
