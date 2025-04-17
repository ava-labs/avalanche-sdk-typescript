import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetFeeConfigReturnType } from "./types/getFeeConfig.js";

export async function getFeeConfig<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetFeeConfigReturnType> {
  const feeConfig = await client.request<
    PlatformChainRpcSchema,
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