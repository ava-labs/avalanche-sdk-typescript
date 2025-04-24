import { Chain, Transport } from "viem";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetBalanceParameters, GetBalanceReturnType } from "./types/getBalance.js";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";

export async function getBalance<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetBalanceParameters
): Promise<GetBalanceReturnType> {
  const balance = await client.request<
    PChainRpcSchema,
    {
      method: "platform.getBalance";
      params: GetBalanceParameters;
    },
    GetBalanceReturnType
  >({
    method: "platform.getBalance",
    params,
  });
  return {
    ...balance,
    balance: BigInt(balance.balance),
    unlocked: BigInt(balance.unlocked),
    lockedNotStakeable: BigInt(balance.lockedNotStakeable),
    lockedStakeable: BigInt(balance.lockedStakeable),
  };
}
