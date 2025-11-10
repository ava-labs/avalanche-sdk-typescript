import { pvmSerial, utils } from "@avalabs/avalanchejs";
import { sha256 } from "@noble/hashes/sha256";
import { Client, hexToBytes, parseAbiItem } from "viem";
import { getBlockNumber, getLogs } from "viem/actions";
import { AvalancheCoreClient } from "../../clients/createAvalancheCoreClient.js";
import {
  GetRegistrationJustificationParams,
  GetRegistrationJustificationReturnType,
} from "./types/getRegistrationJustification.js";
import {
  computeDerivedID,
  marshalConvertSubnetToL1TxDataJustification,
} from "./utils.js";

// Define the ABI for the SendWarpMessage event
export const sendWarpMessageEventAbi = parseAbiItem(
  "event SendWarpMessage(address indexed sourceAddress, bytes32 indexed unsignedMessageID, bytes message)"
);

export async function getRegistrationJustification(
  client: AvalancheCoreClient,
  params: GetRegistrationJustificationParams
): Promise<GetRegistrationJustificationReturnType> {
  const WARP_ADDRESS = "0x0200000000000000000000000000000000000005" as const;
  const NUM_BOOTSTRAP_VALIDATORS_TO_SEARCH = 100;

  const { validationIDHex, subnetIDStr } = params;
  let targetValidationIDBytes: Uint8Array;

  try {
    targetValidationIDBytes = hexToBytes(validationIDHex as `0x${string}`);
    if (targetValidationIDBytes.length !== 32) {
      throw new Error(
        `Decoded validationID must be 32 bytes, got ${targetValidationIDBytes.length}`
      );
    }
  } catch (e: any) {
    console.error(
      `Failed to decode provided validationIDHex '${validationIDHex}': ${e.message}`
    );
    return { justification: null };
  }

  if (!subnetIDStr) {
    console.error(`Failed to decode provided SubnetID: ${subnetIDStr}`);
    return { justification: null };
  }
  const subnetIDBytes = utils.base58check.decode(subnetIDStr);

  if (!subnetIDBytes) {
    console.error(`Failed to decode provided SubnetID: ${subnetIDStr}`);
    return { justification: null };
  }

  // 1. Check for bootstrap validators (comparing hash of derived ID against targetValidationIDBytes)
  for (let index = 0; index < NUM_BOOTSTRAP_VALIDATORS_TO_SEARCH; index++) {
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
  try {
    const CHUNK_SIZE = 2000; // Number of blocks to query in each chunk (reduced to stay within RPC limits)
    const MAX_CHUNKS = 100; // Maximum number of chunks to try (to prevent infinite loops)
    let toBlock: bigint | number | "latest" = "latest";
    let foundMatch = false;
    let marshalledJustification: Uint8Array | null = null;
    let chunksSearched = 0;

    console.log(
      `Searching Warp logs in chunks of ${CHUNK_SIZE} blocks starting from latest...`
    );

    while (!foundMatch && chunksSearched < MAX_CHUNKS) {
      // Get the current block number for this iteration
      const latestBlockNum =
        toBlock === "latest" ? await getBlockNumber(client as Client) : toBlock;

      // Calculate the fromBlock for this chunk
      const fromBlockNum = Math.max(0, Number(latestBlockNum) - CHUNK_SIZE);

      console.log(
        `Searching blocks ${fromBlockNum} to ${
          toBlock === "latest" ? latestBlockNum : toBlock
        }...`
      );

      const warpLogs = await getLogs(client as Client, {
        address: WARP_ADDRESS,
        event: sendWarpMessageEventAbi,
        fromBlock: BigInt(fromBlockNum),
        toBlock: toBlock === "latest" ? toBlock : BigInt(Number(toBlock)),
      });

      const warpManager = pvmSerial.warp.getWarpManager();

      if (warpLogs.length > 0) {
        console.log(
          `Found ${warpLogs.length} Warp logs in current chunk. Searching for ValidationID ${validationIDHex}...`
        );

        for (const log of warpLogs.slice().reverse()) {
          try {
            const decodedArgs = log.args as { message?: `0x${string}` };
            const fullMessageHex = decodedArgs.message;
            if (!fullMessageHex) continue;

            const unsignedMessageBytes = Buffer.from(
              fullMessageHex.slice(2),
              "hex"
            );

            const addressedCall = warpManager.unpack(
              unsignedMessageBytes,
              pvmSerial.warp.AddressedCallPayloads.AddressedCall
            );

            if (addressedCall.length === 0) continue;

            // Check TypeID within AddressedCall for RegisterL1ValidatorMessage
            if (addressedCall.length < 6) continue;
            const acTypeID =
              (addressedCall[2] << 24) |
              (addressedCall[3] << 16) |
              (addressedCall[4] << 8) |
              addressedCall[5];
            const REGISTER_L1_VALIDATOR_MESSAGE_TYPE_ID_IN_AC = 1;
            if (acTypeID !== REGISTER_L1_VALIDATOR_MESSAGE_TYPE_ID_IN_AC) {
              continue;
            }

            const payloadBytes = extractPayloadFromAddressedCall(addressedCall);
            if (!payloadBytes) continue;

            try {
              // Unpack the payload
              const parsedPayload: SolidityValidationPeriod =
                unpackRegisterL1ValidatorPayload(payloadBytes);
              // Calculate the validationID (hash) of this message payload
              const logValidationIDBytes = calculateValidationID(parsedPayload);

              // Compare the calculated hash with the target validation ID
              if (compareBytes(logValidationIDBytes, targetValidationIDBytes)) {
                // Construct justification using the original payloadBytes
                const tag = new Uint8Array([0x12]); // Field 2, wire type 2
                const lengthVarint = encodeVarint(payloadBytes.length);
                marshalledJustification = new Uint8Array(
                  tag.length + lengthVarint.length + payloadBytes.length
                );
                marshalledJustification.set(tag, 0);
                marshalledJustification.set(lengthVarint, tag.length);
                marshalledJustification.set(
                  payloadBytes,
                  tag.length + lengthVarint.length
                );

                console.log(
                  `Found matching ValidationID ${validationIDHex} in Warp log (Tx: ${log.transactionHash}). Marshalled justification.`
                );
                foundMatch = true;
                break;
              }
            } catch (parseOrHashError) {
              // console.warn(`Error parsing/hashing RegisterL1ValidatorMessage payload from Tx ${log.transactionHash}:`, parseOrHashError);
            }
          } catch (logProcessingError) {
            console.error(
              `Error processing log entry for tx ${log.transactionHash}:`,
              logProcessingError
            );
          }
        }
      } else {
        console.log(
          `No Warp logs found in blocks ${fromBlockNum} to ${
            toBlock === "latest" ? latestBlockNum : toBlock
          }.`
        );
      }

      // Exit the loop if we found a match
      if (foundMatch) break;

      // Move to the previous chunk
      toBlock = fromBlockNum - 1;

      // Stop if we've reached the genesis block
      if (toBlock <= 0) {
        console.log(`Reached genesis block. Search complete.`);
        break;
      }

      chunksSearched++;
    }

    if (!foundMatch) {
      console.log(
        `No matching registration log found for ValidationID ${validationIDHex} after searching ${chunksSearched} chunks.`
      );
    }

    return { justification: marshalledJustification ?? null };
  } catch (fetchLogError) {
    console.error(
      `Error fetching or decoding logs for ValidationID ${validationIDHex}:`,
      fetchLogError
    );
    return { justification: null };
  }
}
