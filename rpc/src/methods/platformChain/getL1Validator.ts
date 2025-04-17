import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetL1ValidatorParameters, GetL1ValidatorReturnType } from "./types/getL1Validator.js";

export async function getL1Validator<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetL1ValidatorParameters
): Promise<GetL1ValidatorReturnType> {
  const l1Validator = await client.request<
    PlatformChainRpcSchema,
    {
      method: "platform.getL1Validator";
      params: GetL1ValidatorParameters;
    },
    GetL1ValidatorReturnType
  >({
    method: "platform.getL1Validator",
    params,
  });

  return {
    ...l1Validator,
    startTime: BigInt(l1Validator.startTime),
    weight: BigInt(l1Validator.weight),
    ...(l1Validator.minNonce && { minNonce: BigInt(l1Validator.minNonce) }),
    ...(l1Validator.balance && { balance: BigInt(l1Validator.balance) }),
    ...(l1Validator.height && { height: BigInt(l1Validator.height) }),
  }
}
