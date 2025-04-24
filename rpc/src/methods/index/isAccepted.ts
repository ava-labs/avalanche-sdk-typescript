import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { IndexRpcSchema } from "./indexRpcSchema.js";
import {
  IsAcceptedParameters,
  IsAcceptedReturnType,
} from "./types/isAccepted.js";

export async function isAccepted<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: IsAcceptedParameters
): Promise<IsAcceptedReturnType> {
  return client.request<
    IndexRpcSchema,
    { method: "index.isAccepted"; params: IsAcceptedParameters },
    IsAcceptedReturnType
  >({
    method: "index.isAccepted",
    params,
  });
}
