import { Utxo } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../clients/createAvalancheWalletCoreClient.js";
import { getUTXOs as getPChainUTXOs } from "../methods/pChain/getUTXOs.js";
import { getUTXOs as getXChainUTXOs } from "../methods/xChain/getUTXOs.js";
import { GetUTXOsReturnType } from "../methods/xChain/types/getUTXOs.js";
import { getUtxoFromBytes } from "./getUtxoFromBytes.js";

/**
 * @description Get the UTXOs for an address.
 *
 * @param client - The client to use. {@link AvalancheWalletCoreClient}
 * @param params - The parameters. {@link { address: string, chainAlias: "P" | "X" }}
 * @returns The array of UTXOs. May contain duplicates. {@link [Utxo]}
 *
 * @example
 * ```ts
 * import { createAvalancheWalletCoreClient } from "@avalanche-sdk/rpc";
 * import { avalanche } from "@avalanche-sdk/rpc/chains";
 *
 * const client = createAvalancheWalletCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * });
 *
 * const utxos = await getUtxosForAddress(client, {
 *   address: "0x1234567890123456789012345678901234567890",
 *   chainAlias: "P",
 * });
 * ```
 */
export async function getUtxosForAddress(
  client: AvalancheWalletCoreClient,
  params: {
    address: string;
    chainAlias: "P" | "X";
  }
) {
  // Get the correct UTXO function based on the chain alias
  const getUTXOs = params.chainAlias === "P" ? getPChainUTXOs : getXChainUTXOs;

  // Initialize the UTXOs array and start index
  const utxos: Utxo[] = [];

  // Initialize the start index and has more flag
  let startIndex:
    | {
        address: string;
        utxo: string;
      }
    | undefined = undefined;
  let hasMore = false;

  // Fetch UTXOs until there are no more
  do {
    const utxosRes = (await getUTXOs(client.pChainClient, {
      addresses: [params.address],
      ...(startIndex === undefined ? {} : { startIndex }),
    })) as GetUTXOsReturnType;

    utxos.push(
      ...utxosRes.utxos.map((utxo: string) =>
        getUtxoFromBytes(utxo, params.chainAlias)
      )
    );

    if (Number(utxosRes.numFetched) >= 1024) {
      hasMore = true;
      startIndex = {
        address: utxosRes.endIndex.address,
        utxo: utxosRes.endIndex.utxo,
      };
    } else {
      hasMore = false;
    }

    if (utxos.length >= 5000) {
      console.warn(
        "getUtxosForAddress: Reached max utxos limit. Returning partial results."
      );
      break;
    }
  } while (hasMore);

  return utxos;
}
