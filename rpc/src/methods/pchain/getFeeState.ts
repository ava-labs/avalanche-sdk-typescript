import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetFeeStateReturnType } from "./types/getFeeState.js";

export async function getFeeState<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetFeeStateReturnType> {
  const feeState = await client.request<
    PChainRpcSchema,
    {
      method: "platform.getFeeState";
      params: {};
    },
    GetFeeStateReturnType
  >({
    method: "platform.getFeeState",
    params: {},
  });

  return {
    ...feeState,
    capacity: BigInt(feeState.capacity),
    excess: BigInt(feeState.excess),
    price: BigInt(feeState.price),
  }
}
