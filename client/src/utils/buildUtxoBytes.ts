import {
  avaxSerial,
  BigIntPr,
  Id,
  Int,
  OutputOwners,
  pvmSerial,
  Short,
  TransferOutput,
  utils,
  Utxo,
} from "@avalabs/avalanchejs";

/**
 * Builds UTXO bytes from the given UTXO parameters.
 * @param txHash - The transaction hash of the transaction which created this output.
 * @param outputIndex - The index of the output in the transaction which created this output.
 * @param assetId - The asset ID of the created output.
 * @param amount - The amount of the asset held in this output.
 * @param addresses - The addresses who can sign the transaction for consuming this output.
 * @param locktime - The UNIX timestamp in seconds after which this output can be consumed.
 * @param threshold - The threshold of the addresses who can sign the transaction for consuming this output.
 * @param stakeableLocktime - The stakeable locktime in seconds before which this output can only be used as staking input.
 * @returns The UTXO hex string.
 *
 * @example
 * ```ts
 * import { buildUtxoBytes } from "@avalanche-sdk/client/utils";
 * const utxoBytes = buildUtxoBytes(
 *   "mYxFK3CWs6iMFFaRx4wmVLDUtnktzm2o9Mhg9AG6JSzRijy5V",
 *   0,
 *   "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK",
 *   "111947",
 *   ["P-fuji1nv6w7m6egkwhkcvz96ze3qmzyk5gt6csqz7ejq"],
 *   "0",
 *   1
 * );
 * ```
 */
export function buildUtxoBytes(
  txHash: string,
  outputIndex: number,
  assetId: string,
  amount: string,
  addresses: string[],
  locktime: string,
  threshold: number,
  stakeableLocktime = '0',
): `0x${string}` {
  const transferOutput = new TransferOutput(
    new BigIntPr(BigInt(amount)),
    OutputOwners.fromNative(
      addresses
        .map(
          (addr) =>
            utils.parseBech32(
              addr.replace("P-", "").replace("X-", "").replace("C-", "")
            )[1] // returns [hrp, addressBytes]
        )
        .sort(utils.bytesCompare),
      BigInt(locktime ?? 0),
      threshold
    )
  );

  const stakeableLockOut = new pvmSerial.StakeableLockOut(
    new BigIntPr(BigInt(stakeableLocktime ?? 0)),
    transferOutput,
  );

  const utxo = new Utxo(
    new avaxSerial.UTXOID(Id.fromString(txHash), new Int(outputIndex)),
    Id.fromString(assetId),
    stakeableLocktime !== '0' ? stakeableLockOut : transferOutput
  );

  return utils.bufferToHex(
    utils.addChecksum(
      utils.concatBytes(
        new Short(0).toBytes(), // codec verison
        utxo.toBytes(utils.getManagerForVM("PVM").getDefaultCodec()) // default codec for all chains
      )
    )
  ) as `0x${string}`;
}
