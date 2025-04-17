import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetPChainBalanceParameters, GetPChainBalanceReturnType } from "./types/getPChainBalance.js";

export async function getPChainBalance<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetPChainBalanceParameters
): Promise<GetPChainBalanceReturnType> {
  const balance = await client.request<
    PlatformChainRpcSchema,
    {
      method: "platform.getBalance";
      params: GetPChainBalanceParameters;
    },
    GetPChainBalanceReturnType
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
