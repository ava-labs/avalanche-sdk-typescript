import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetFeeConfigReturnType } from "./types/getFeeConfig.js";

export async function getFeeConfig<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetFeeConfigReturnType> {
  const feeConfig = await client.request<
    PChainRpcSchema,
    {
      method: "platform.getFeeConfig";
      params: {};
    },
    GetFeeConfigReturnType
  >({
    method: "platform.getFeeConfig",
    params: {},
  });
  return {
    ...feeConfig,
    maxCapacity: BigInt(feeConfig.maxCapacity),
    maxPerSecond: BigInt(feeConfig.maxPerSecond),
    minPrice: BigInt(feeConfig.minPrice),
    targetPerSecond: BigInt(feeConfig.targetPerSecond),
    excessConversionConstant: BigInt(feeConfig.excessConversionConstant),
  };
}