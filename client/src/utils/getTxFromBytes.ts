import { Common, Credential, UnsignedTx, utils } from "@avalabs/avalanchejs";

/**
 *  Get a transaction from a buffer or hex string
 * @param txBytes - The buffer or hex string to get the transaction from `string` or `Uint8Array`
 * @param chainAlias - The chain alias to get the transaction from `"P" | "X" | "C"`
 * @returns A array with the transaction {@link Common.Transaction} and credentials {@link Credential[]}
 *
 * @example
 * ```ts
 * import { getTxFromBytes } from "@avalanche-sdk/client/utils";
 *
 * const [tx, credentials] = getTxFromBytes("0x1234567890abcdef", "P");
 * ```
 */
export function getTxFromBytes(
  txBytes: string,
  chainAlias: "P" | "X" | "C"
): [Common.Transaction, Credential[]] {
  const strippedTxBytes = utils.strip0x(txBytes);
  const manager = utils.getManagerForVM(
    chainAlias === "P" ? "PVM" : chainAlias === "X" ? "AVM" : "EVM"
  );

  const parsedTx = manager.unpackTransaction(
    Buffer.from(strippedTxBytes, "hex")
  );
  const txBytesWithoutCreds = utils.bufferToHex(
    parsedTx.toBytes(manager.getDefaultCodec())
  );

  // get first 6 bytes (codec + type)
  const codecAndType = strippedTxBytes.slice(0, 12);

  // replace txBytesWithoutCreds from txBytes to get credentials
  const creds = strippedTxBytes.replace(
    codecAndType + utils.strip0x(txBytesWithoutCreds),
    ""
  );

  // remove type from the creds (frist 4 bytes)
  const credsWithoutType = Buffer.from(utils.strip0x(creds).slice(8), "hex");

  const credentials: Credential[] = [];
  let remainingBytes = new Uint8Array(credsWithoutType);

  // signature length is 65 bytes
  while (remainingBytes.length >= 65) {
    const [cred, rest] = Credential.fromBytes(
      remainingBytes.slice(4),
      manager.getDefaultCodec()
    );
    credentials.push(cred);
    // Ensure remainingBytes is a Uint8Array backed by ArrayBuffer (not SharedArrayBuffer)
    if (rest.buffer instanceof ArrayBuffer) {
      remainingBytes = new Uint8Array(
        rest.buffer,
        rest.byteOffset,
        rest.length
      );
    } else {
      // Fallback: copy bytes into new ArrayBuffer if not
      remainingBytes = new Uint8Array(rest);
    }
  }
  return [parsedTx, credentials];
}

/**
 *  Get an unsigned transaction from a buffer or hex string
 * @param txBytes - The buffer or hex string to get the transaction from `string` or `Uint8Array`
 * @param chainAlias - The chain alias to get the transaction from `"P" | "X" | "C"`
 * @returns An unsigned transaction {@link UnsignedTx}
 *
 * @example
 * ```ts
 * import { getUnsignedTxFromBytes } from "@avalanche-sdk/client/utils";
 *
 * const unsignedTx = getUnsignedTxFromBytes("0x1234567890abcdef", "P");
 * ```
 */
export function getUnsignedTxFromBytes(
  txBytes: string,
  chainAlias: "P" | "X" | "C"
): UnsignedTx {
  const [tx, credentials] = getTxFromBytes(txBytes, chainAlias);
  return new UnsignedTx(tx, [], new utils.AddressMaps(), credentials);
}
