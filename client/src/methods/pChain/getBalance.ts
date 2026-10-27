import { utils, Utxo } from "@avalabs/avalanchejs";
import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { getUtxoFromBytes } from "../../utils/getUtxoFromBytes.js";
import { getStakingAssetID } from "./getStakingAssetID.js";
import { getUTXOs } from "./getUTXOs.js";
import {
  GetBalanceParameters,
  GetBalanceReturnType,
} from "./types/getBalance.js";
import { GetUTXOsParameters } from "./types/getUTXOs.js";

const PRIMARY_NETWORK_ID = "11111111111111111111111111111111LpoYY";

// The maximum page size of platform.getUTXOs in AvalancheGo.
const MAX_UTXOS_PER_PAGE = 1024;

type Bucket = "unlocked" | "lockedStakeable" | "lockedNotStakeable";

/**
 * Get the balance of AVAX controlled by a given address.
 *
 * This function does not call `platform.getBalance`, because AvalancheGo
 * deprecated that method and will remove it. It reads all UTXOs of the
 * addresses with `platform.getUTXOs` (one request for each 1024 UTXOs) and
 * adds them up with the rules of `platform.getBalance`. It gets the AVAX asset
 * ID with `platform.getStakingAssetID`. It uses the local clock to find which
 * outputs are locked.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetutxos
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The addresses to get the balance of {@link GetBalanceParameters}
 * @returns The balance information. {@link GetBalanceReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getBalance } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const balance = await getBalance(client, {
 *   addresses: ["P-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p"]
 * })
 * ```
 */
export async function getBalance<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetBalanceParameters
): Promise<GetBalanceReturnType> {
  const [{ assetID: avaxAssetID }, utxos] = await Promise.all([
    getStakingAssetID(client, { subnetID: PRIMARY_NETWORK_ID }),
    getAllUTXOs(client, params.addresses),
  ]);

  const now = BigInt(Math.floor(Date.now() / 1000));
  const amounts: Record<Bucket, Record<string, bigint>> = {
    unlocked: {},
    lockedStakeable: {},
    lockedNotStakeable: {},
  };
  const utxoIDs: GetBalanceReturnType["utxoIDs"] = [];
  for (const utxo of utxos) {
    const counted = countOutput(utxo.output, now);
    if (counted === undefined) {
      continue;
    }
    const byAsset = amounts[counted.bucket];
    const assetID = utxo.getAssetId();
    byAsset[assetID] = (byAsset[assetID] ?? 0n) + counted.amount;
    utxoIDs.push({
      txID: utxo.utxoId.txID.toString(),
      outputIndex: utxo.utxoId.outputIdx.value(),
    });
  }

  const totals: Record<string, bigint> = {};
  for (const byAsset of Object.values(amounts)) {
    for (const [assetID, amount] of Object.entries(byAsset)) {
      totals[assetID] = (totals[assetID] ?? 0n) + amount;
    }
  }

  return {
    balance: totals[avaxAssetID] ?? 0n,
    unlocked: amounts.unlocked[avaxAssetID] ?? 0n,
    lockedStakeable: amounts.lockedStakeable[avaxAssetID] ?? 0n,
    lockedNotStakeable: amounts.lockedNotStakeable[avaxAssetID] ?? 0n,
    balances: toDecimalStrings(totals),
    unlockeds: toDecimalStrings(amounts.unlocked),
    lockedStakeables: toDecimalStrings(amounts.lockedStakeable),
    lockedNotStakeables: toDecimalStrings(amounts.lockedNotStakeable),
    utxoIDs,
  };
}

/**
 * Get all UTXOs of the addresses, one page at a time, in the order of
 * `platform.getBalance`.
 */
async function getAllUTXOs<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  addresses: string[]
): Promise<Utxo[]> {
  // platform.getUTXOs rejects an empty list; platform.getBalance returned 0.
  if (addresses.length === 0) {
    return [];
  }

  const utxos = new Map<string, Utxo>();
  let startIndex: GetUTXOsParameters["startIndex"];
  for (;;) {
    const page = await getUTXOs(client, {
      addresses,
      encoding: "hex",
      ...(startIndex === undefined ? {} : { startIndex }),
    });
    for (const utxoHex of page.utxos) {
      const utxo = getUtxoFromBytes(utxoHex, "P");
      // A UTXO owned by 2 of the addresses can be on 2 pages. The map keeps
      // it once, at its first position.
      utxos.set(utxo.ID(), utxo);
    }
    if (Number(page.numFetched) < MAX_UTXOS_PER_PAGE) {
      return [...utxos.values()];
    }
    startIndex = page.endIndex;
  }
}

/**
 * Get the bucket and the amount of a UTXO output. The rules are the same as
 * `GetBalance` in AvalancheGo `vms/platformvm/service.go`. Returns `undefined`
 * for an output that `platform.getBalance` does not count.
 */
function countOutput(
  output: Utxo["output"],
  now: bigint
): { bucket: Bucket; amount: bigint } | undefined {
  if (utils.isTransferOut(output)) {
    return {
      bucket: output.getLocktime() <= now ? "unlocked" : "lockedNotStakeable",
      amount: output.amount(),
    };
  }
  if (
    utils.isStakeableLockOut(output) &&
    utils.isTransferOut(output.transferOut)
  ) {
    let bucket: Bucket = "lockedStakeable";
    if (output.transferOut.getLocktime() > now) {
      bucket = "lockedNotStakeable";
    } else if (output.getStakeableLocktime() <= now) {
      bucket = "unlocked";
    }
    return { bucket, amount: output.amount() };
  }
  return undefined;
}

function toDecimalStrings(
  byAsset: Record<string, bigint>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(byAsset).map(([assetID, amount]) => [
      assetID,
      amount.toString(),
    ])
  );
}
