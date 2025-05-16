import { Common, Credential, utils } from "@avalabs/avalanchejs";
import { Hex } from "viem";

export function getTxFromBytes(
  txBytes: Hex,
  chainAlias: string
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
    remainingBytes = rest;
  }
  return [parsedTx, credentials];
}
