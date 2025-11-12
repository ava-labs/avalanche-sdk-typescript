import { expect, test } from "vitest";

import * as exports from "./index.js";

test("exports", () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "Address",
      "avaxSerial",
      "AVM",
      "avmSerial",
      "BigIntPr",
      "BlsSignature",
      "Byte",
      "Bytes",
      "Credential",
      "EVM",
      "evmSerial",
      "Id",
      "Input",
      "Int",
      "L1Validator",
      "MintOperation",
      "MintOutput",
      "NodeId",
      "OutputOwners",
      "OutputOwnersList",
      "PChainOwner",
      "PVM",
      "pvmSerial",
      "Short",
      "Signature",
      "Stringpr",
      "TransferableInput",
      "TransferableOutput",
      "TransferInput",
      "TransferOutput",
      "TypeRegistry",
      "TypeSymbols",
      "Utxo",
      "ValidVMs",
    ]
  `);
});
