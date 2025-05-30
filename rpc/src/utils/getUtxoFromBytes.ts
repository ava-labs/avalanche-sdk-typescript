import { utils, Utxo } from "@avalabs/avalanchejs";

/**
 * @description Get a Utxo from a buffer or hex string
 * @param utxoBytesOrHex - The buffer or hex string to get the Utxo from {@link string | Uint8Array}
 * @param chainAlias - The chain alias to get the Utxo from {@link "P" | "X"}
 * @returns The Utxo {@link Utxo}
 *
 * @example
 * ```ts
 * import { getUtxoFromBytes } from "@avalanche-sdk/rpc/utils";
 *
 * const utxo = getUtxoFromBytes("0x1234567890abcdef", "P");
 * ```
 */
export function getUtxoFromBytes(
  utxoBytesOrHex: string | Uint8Array,
  chainAlias: "P" | "X"
): Utxo {
  let utxoBytes;
  if (typeof utxoBytesOrHex === "string") {
    utxoBytes = utils.hexToBuffer(utxoBytesOrHex);
  } else {
    utxoBytes = utxoBytesOrHex;
  }
  const manager = utils.getManagerForVM(chainAlias === "P" ? "PVM" : "AVM");

  const utxo = manager.unpack(utxoBytes, Utxo);
  return utxo;
}
