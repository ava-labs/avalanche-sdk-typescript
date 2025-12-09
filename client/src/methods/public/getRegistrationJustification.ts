import { Int, pvmSerial, Short, utils } from "@avalabs/avalanchejs";
import { sha256 } from "@noble/hashes/sha256";
import { Chain, Client, hexToBytes, parseAbiItem, Transport } from "viem";
import { getBlockNumber, getLogs } from "viem/actions";
import {
  GetRegistrationJustificationParams,
  GetRegistrationJustificationReturnType,
} from "./types/getRegistrationJustification.js";
import {
  computeDerivedID,
  marshalConvertSubnetToL1TxDataJustification,
  marshalRegisterL1ValidatorMessageJustification,
} from "./utils.js";

// Define the ABI for the SendWarpMessage event
export const sendWarpMessageEventAbi = parseAbiItem(
  "event SendWarpMessage(address indexed sourceAddress, bytes32 indexed unsignedMessageID, bytes message)"
);

const WARP_ADDRESS = "0x0200000000000000000000000000000000000005" as const;

/**
 * Retrieves the registration justification for the given validation ID Hex and subnet ID.
 *
 * If the validation ID corresponds to a bootstrap validator, the justification bytes
 * produced by `ConvertSubnetToL1Tx` are returned.
 *
 * Otherwise, the function searches the Warp logs on the chain where the validator
 * manager is deployed to locate the RegisterL1ValidatorMessage for the specified validation ID.
 *
 * @param client - The AvalancheCoreClient instance.
 * @param params - The GetRegistrationJustificationParams instance.
 * @returns The GetRegistrationJustificationReturnType instance.
 *
 * @example
 * ```ts
 * import { createAvalancheClient } from "@avalanche-sdk/client";
 * import { getRegistrationJustification } from "@avalanche-sdk/client/methods/public";
 * import { defineChain } from "@avalanche-sdk/client/chains";
 * import { utils } from "@avalanche-sdk/client/utils";
 *
 * const chainConfig = defineChain({
 *     id: 28098,
 *     name: "Rough Complexity Chain",
 *     rpcUrls: {
 *       default: {
 *         http: [
 *           "https://base-url-to-your-rpc/ext/bc/28zXo5erueBemgxPjLom6Vhsm6oVyftLtfQSt61fd62SghoXrz/rpc",
 *         ],
 *       },
 *     },
 *   });
 *
 * const publicClient = createAvalancheClient({
 *   chain: chainConfig,
 *   transport: {
 *     type: "http",
 *   },
 * });
 *
 * const validationIDHex = utils.bufferToHex(
 *   utils.base58check.decode(
 *     "TEwxg8JzAUsqFibtYkaiiYH9G1h5ZfX56zYURXpyaPRCSppC4"
 *   )
 * );
 *
 * const justification = await getRegistrationJustification(publicClient, {
 *   validationIDHex,
 *   subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
 *   maxBootstrapValidators: 200,
 *   chunkSize: 200,
 *   maxChunks: 100,
 * });
 *
 * console.log("justification", JSON.stringify(justification, null, 2));
 * ```
 */
export async function getRegistrationJustification<
  chain extends Chain | undefined
>(
  client: Client<Transport, chain>,
  params: GetRegistrationJustificationParams
): Promise<GetRegistrationJustificationReturnType> {
  const DEFAULT_NUM_BOOTSTRAP_VALIDATORS_TO_SEARCH = 100;
  const numBValidatorsToSearch =
    params.maxBootstrapValidators ?? DEFAULT_NUM_BOOTSTRAP_VALIDATORS_TO_SEARCH;

  const { validationID, subnetIDStr } = params;
  let targetValidationIDBytes: Uint8Array;
  let validationIDHex;
  let subnetIDBytes;

  try {
    if (!validationID) {
      throw new Error(`Found empty validationID`);
    }

    if (validationID.startsWith("0x")) {
      validationIDHex = validationID;
    } else {
      validationIDHex = utils.bufferToHex(
        utils.base58check.decode(validationID)
      );
    }
    targetValidationIDBytes = hexToBytes(validationIDHex as `0x${string}`);
    if (targetValidationIDBytes.length !== 32) {
      throw new Error(
        `Decoded validationID must be 32 bytes, got ${targetValidationIDBytes.length}`
      );
    }
  } catch (e: any) {
    return {
      justification: null,
      error: `Failed to decode provided validationIDHex '${validationIDHex}': ${e.message}`,
    };
  }

  try {
    if (!subnetIDStr) {
      throw new Error(`Found empty subnetIDStr`);
    }
    subnetIDBytes = utils.base58check.decode(subnetIDStr);
  } catch (e: any) {
    return {
      justification: null,
      error: `Failed to decode provided SubnetID: ${subnetIDStr}: ${e.message}`,
    };
  }

  // 1. Check for bootstrap validators (comparing hash of derived ID against targetValidationIDBytes)
  for (let index = 0; index < numBValidatorsToSearch; index++) {
    // Compute the 36-byte derived ID (SubnetID + Index)
    const bootstrapDerivedBytes = computeDerivedID(subnetIDBytes, index);
    // Compute the SHA-256 hash (32 bytes)
    const bootstrapValidationIDHash = sha256(bootstrapDerivedBytes);

    // Compare the derived hash with the target validation ID
    if (utils.bytesEqual(bootstrapValidationIDHash, targetValidationIDBytes)) {
      console.log(
        `ValidationID ${validationIDHex} matches HASH of bootstrap validator derived ID (subnet ${subnetIDStr}, index ${index})`
      );
      // Marshal justification using the *original* subnetID and index
      const justificationBytes = marshalConvertSubnetToL1TxDataJustification(
        subnetIDBytes,
        index
      );
      return {
        justification: justificationBytes,
      };
    }
  }

  // 2. If not a bootstrap validator, search Warp logs
  return await searchWarpLogsForJustification(
    client,
    params,
    targetValidationIDBytes,
    validationIDHex
  );
}

/**
 * Searches Warp logs for registration justification
 */
async function searchWarpLogsForJustification<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetRegistrationJustificationParams,
  targetValidationIDBytes: Uint8Array,
  validationIDHex: string
): Promise<GetRegistrationJustificationReturnType> {
  const DEFAULT_CHUNK_SIZE = 2000;
  const DEFAULT_MAX_CHUNKS = 100;
  const maxChunks = params.maxChunks ?? DEFAULT_MAX_CHUNKS;
  const searchOrder = params.searchOrder ?? "desc";
  const chunkSize = params.chunkSize ?? DEFAULT_CHUNK_SIZE;
  try {
    // Get the latest block number to determine search bounds
    const latestBlockNumber = await getBlockNumber(client as Client);

    // Determine starting block and search bounds
    const startBlock =
      params.startBlock === "latest" || params.startBlock === undefined
        ? latestBlockNumber
        : BigInt(params.startBlock);

    let currentBlock = startBlock;
    let chunksSearched = 0;

    console.log(
      `Searching Warp logs in ${
        searchOrder === "desc" ? "descending" : "ascending"
      } order, ` +
        `chunks of ${chunkSize} blocks, starting from block ${currentBlock}...`
    );

    while (chunksSearched < maxChunks) {
      // Calculate block range for this chunk based on search order
      const { fromBlock, toBlock, shouldStopAfter } = calculateBlockRange(
        currentBlock,
        chunkSize,
        searchOrder,
        latestBlockNumber
      );

      console.log(`Searching blocks ${fromBlock} to ${toBlock}...`);

      // Fetch Warp logs for this block range
      const warpLogs = await getLogs(client as Client, {
        address: WARP_ADDRESS,
        event: sendWarpMessageEventAbi,
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(toBlock),
      });
      if (warpLogs.length > 0) {
        console.log(
          `Found ${warpLogs.length} Warp logs in current chunk. Searching for ValidationID ${validationIDHex}...`
        );

        const justification = processWarpLogs(
          warpLogs.slice().reverse(),
          targetValidationIDBytes,
          validationIDHex
        );

        if (justification) {
          return { justification };
        }
      } else {
        console.log(`No Warp logs found in blocks ${fromBlock} to ${toBlock}.`);
      }

      if (shouldStopAfter) {
        break;
      }

      // Move to next chunk
      currentBlock =
        searchOrder === "desc" ? BigInt(fromBlock) - 1n : BigInt(toBlock) + 1n;

      // Check for ascending order to ensure we don't exceed latest
      if (searchOrder === "asc" && currentBlock > latestBlockNumber) {
        break;
      }

      chunksSearched++;
    }

    return { justification: null };
  } catch (fetchLogError) {
    return {
      justification: null,
      error: `Error fetching or decoding logs for ValidationID ${validationIDHex}: ${fetchLogError}`,
    };
  }
}

/**
 * Calculates the block range for a search chunk based on search order
 */
function calculateBlockRange(
  currentBlock: bigint,
  chunkSize: number,
  searchOrder: "asc" | "desc",
  latestBlock: bigint
): {
  fromBlock: number;
  toBlock: number;
  shouldStopAfter: boolean;
} {
  const genesisBlock = 0;
  if (searchOrder === "desc") {
    const fromBlock = Math.max(
      genesisBlock,
      Number(currentBlock) - chunkSize + 1
    );
    const toBlock = Number(currentBlock);
    const shouldStopAfter = fromBlock === genesisBlock;

    return { fromBlock, toBlock, shouldStopAfter };
  } else {
    const fromBlock = Number(currentBlock);
    const toBlock = Math.min(
      Number(latestBlock),
      Number(currentBlock) + chunkSize - 1
    );
    const shouldStopAfter = toBlock >= Number(latestBlock);

    return { fromBlock, toBlock, shouldStopAfter };
  }
}

/**
 * Parses Warp logs to find matching validation ID
 */
function processWarpLogs(
  logs: Awaited<ReturnType<typeof getLogs>>,
  targetValidationIDBytes: Uint8Array,
  validationIDHex: string
): Uint8Array | null {
  const warpManager = pvmSerial.warp.getWarpManager();
  const REGISTER_L1_VALIDATOR_MESSAGE_TYPE_ID_IN_AC = 1;

  for (const log of logs) {
    try {
      const logWithArgs = log as typeof log & {
        args: { message?: `0x${string}` };
      };
      const fullMessageHex = logWithArgs.args?.message;
      if (!fullMessageHex) continue;

      const unsignedMessageBytes = Buffer.from(fullMessageHex.slice(2), "hex");

      const unsignedWarpMessage = warpManager.unpack(
        unsignedMessageBytes,
        pvmSerial.warp.WarpUnsignedMessage
      );

      const addressedCall = warpManager.unpack(
        utils.hexToBuffer(unsignedWarpMessage.payload.toJSON()),
        pvmSerial.warp.AddressedCallPayloads.AddressedCall
      );

      const payloadBytes = utils.hexToBuffer(addressedCall.getPayload());
      if (!payloadBytes) continue;

      const [, codecRemovedPayloadBytes] = Short.fromBytes(payloadBytes);
      const [payloadTypeId] = Int.fromBytes(codecRemovedPayloadBytes);

      if (
        payloadTypeId.value() !== REGISTER_L1_VALIDATOR_MESSAGE_TYPE_ID_IN_AC
      ) {
        continue;
      }

      try {
        const parsedPayload = warpManager.unpack(
          payloadBytes,
          pvmSerial.warp.AddressedCallPayloads.RegisterL1ValidatorMessage
        );
        const logValidationIDBytes = parsedPayload.toBytes(
          pvmSerial.warp.codec
        );
        const paddedLogValidationIDBytes = Uint8Array.from([
          ...new Short(0).toBytes(),
          ...logValidationIDBytes,
        ]);
        const validationIDBytesHash = sha256(paddedLogValidationIDBytes);

        if (utils.bytesEqual(validationIDBytesHash, targetValidationIDBytes)) {
          const justification =
            marshalRegisterL1ValidatorMessageJustification(payloadBytes);

          console.log(
            `Found matching ValidationID ${validationIDHex} in Warp log (Tx: ${log.transactionHash}). Marshalled justification.`
          );
          return justification;
        }
      } catch (parseOrHashError) {
        console.error(parseOrHashError);
      }
    } catch (logProcessingError) {
      console.error(
        `Error processing log entry for tx ${log.transactionHash}:`,
        logProcessingError
      );
    }
  }

  return null;
}
