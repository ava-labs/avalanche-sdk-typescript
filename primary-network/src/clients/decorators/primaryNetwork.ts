import { Account, Chain, Transport } from "@avalanche-sdk/rpc";
import {
  prepareAddPermissionlessDelegatorTx,
  PrepareAddPermissionlessDelegatorTxParameters,
} from "../../methods/transactions/prepareAddPermissionlessDelegatorTx.js";
import { AddPermissionlessDelegatorTx } from "../../types/transactions.js";
import { PrimaryNetworkCoreClient as Client } from "../primaryNetworkCoreClient.js";

export type PrimaryNetworkActions = {
  prepareAddPermissionlessDelegatorTx: (
    parameters: PrepareAddPermissionlessDelegatorTxParameters
  ) => Promise<AddPermissionlessDelegatorTx>;
};

export function primaryNetworkActions<
  transport extends Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined
>(client: Client<transport, chain, account>): PrimaryNetworkActions {
  return {
    prepareAddPermissionlessDelegatorTx: (args) =>
      prepareAddPermissionlessDelegatorTx(client, args),
  };
}
