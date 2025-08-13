import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { transferCtoCChain } from "./transferUtils/transferCtoCChain.js";
import { transferCtoPChain } from "./transferUtils/transferCtoPChain.js";
import { transferPtoCChain } from "./transferUtils/transferPtoCChain.js";
import { transferPtoPChain } from "./transferUtils/transferPtoPChain.js";
import { SendParameters, SendReturnType } from "./types/send.js";

/**
 *  Sends tokens from the source chain to the destination chain.
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link SendParameters}
 * @returns The hashes of the transactions. {@link SendReturnType}
 *
 * @example
 * ```ts
 * import { AvalancheWalletCoreClient } from "@avalabs/wallet-core-client";
 * import { send } from "@avalabs/wallet-core-client/methods/wallet/send";
 *
 * const client = new AvalancheWalletCoreClient({
 *   network: "mainnet",
 *   transport: {
 *     type: "custom",
 *     provider: window.avalanche,
 *   },
 * });
 *
 * const txHashes = await send(client, {
 *   amount: 1,
 *   to: "0x0000000000000000000000000000000000000000",
 * });
 */
export async function send(
  client: AvalancheWalletCoreClient,
  params: SendParameters
): Promise<SendReturnType> {
  const { sourceChain = "C", destinationChain = "C", token = "AVAX" } = params;

  if (token !== "AVAX") {
    throw new Error(`Invalid token: ${token}, only AVAX is supported.`);
  }

  switch (sourceChain) {
    case "C":
      switch (destinationChain) {
        case "C":
          return transferCtoCChain(client, params);
        case "P":
          return transferCtoPChain(client, params);
        default:
          throw new Error(`Invalid destination chain: ${destinationChain}`);
      }
    case "P":
      switch (destinationChain) {
        case "P":
          return transferPtoPChain(client, params);
        case "C":
          return transferPtoCChain(client, params);
        default:
          throw new Error(`Invalid destination chain: ${destinationChain}`);
      }
    default:
      throw new Error(`Invalid source chain: ${sourceChain}`);
  }
}
