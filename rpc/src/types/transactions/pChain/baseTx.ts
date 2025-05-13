import { concatBytes } from "@noble/hashes/utils";
import { hexToBuffer } from "../../../utils/common.js";
import { Bytes } from "../../primitives/bytes.js";
import { Int } from "../../primitives/int.js";
import { StringPr } from "../../primitives/stringpr.js";
import { PChainTransactionTypeSymbols } from "../../typeSymbols.js";
import { parseTypedArraySchema } from "../parseTypedSchema.js";
import { TypeSchema } from "../typeSchema.js";
import { PChainTransferableInput } from "./input/transferableInput.js";
import { PChainTransferableOutput } from "./output/transferableOutput.js";
export const PChainBaseTxSchema: TypeSchema = [
  { key: "typeId", type: Int },
  { key: "networkID", type: Int },
  { key: "blockchainID", type: Bytes, length: 32 },
  { key: "outputs", type: PChainTransferableOutput, isArray: true },
  { key: "inputs", type: PChainTransferableInput, isArray: true },
  { key: "memo", type: Bytes, length: 256 },
] as const;

export type PChainBaseTx = {
  _type: PChainTransactionTypeSymbols.BaseTx;
  value: () => {
    typeId?: Int;
    networkID: Int;
    blockchainID: Bytes;
    outputs: PChainTransferableOutput[];
    inputs: PChainTransferableInput[];
    memo: StringPr;
  };
  toBytes: () => Uint8Array;
  toJSON: () => object;
  toString: () => string;
  valueOf: () => {
    typeId?: Int;
    networkID: Int;
    blockchainID: Bytes;
    outputs: PChainTransferableOutput[];
    inputs: PChainTransferableInput[];
    memo: StringPr;
  };
  [Symbol.toPrimitive](hint: string): string;
};

export const PChainBaseTx = (json: {
  typeId?: number | Int | undefined;
  networkID: number | Int;
  blockchainID: string | Bytes;
  outputs: PChainTransferableOutput[];
  inputs: PChainTransferableInput[];
  memo: string | StringPr;
}): PChainBaseTx => {
  const typeId = !json.typeId
    ? Int(0)
    : typeof json.typeId === "number"
    ? Int(json.typeId)
    : json.typeId;
  const networkID =
    typeof json.networkID === "number" ? Int(json.networkID) : json.networkID;
  const blockchainID =
    typeof json.blockchainID === "string"
      ? Bytes(hexToBuffer(json.blockchainID))
      : json.blockchainID;
  const outputs = json.outputs;
  const inputs = json.inputs;
  const memo = typeof json.memo === "string" ? StringPr(json.memo) : json.memo;

  return {
    _type: PChainTransactionTypeSymbols.BaseTx,
    value: () => ({
      typeId,
      networkID,
      blockchainID,
      outputs,
      inputs,
      memo,
    }),

    toBytes: () => {
      return concatBytes(
        typeId.toBytes(),
        networkID.toBytes(),
        blockchainID.toBytes(),
        concatBytes(
          Int(outputs.length).toBytes(),
          ...outputs.map((e) => e.toBytes())
        ),
        concatBytes(
          Int(inputs.length).toBytes(),
          ...inputs.map((e) => e.toBytes())
        ),
        concatBytes(Int(memo.value().length).toBytes(), memo.toBytes())
      );
    },

    toJSON: () => {
      return {
        typeId: typeId.toJSON(),
        networkID: networkID.toJSON(),
        blockchainID: blockchainID.toJSON(),
        outputs: outputs.map((e) => e.toJSON()),
        inputs: inputs.map((e) => e.toJSON()),
        memo: memo.toJSON(),
      };
    },

    toString: () => {
      return JSON.stringify({
        typeId: typeId.toString(),
        networkID: networkID.toString(),
        blockchainID: blockchainID.toString(),
        outputs: outputs.map((e) => e.toString()),
        inputs: inputs.map((e) => e.toString()),
        memo: memo.toString(),
      });
    },

    valueOf: () => {
      return {
        typeId,
        networkID,
        blockchainID,
        outputs,
        inputs,
        memo,
      };
    },

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") throw new Error("Cannot convert to number");
      return this.toString();
    },
  };
};

PChainBaseTx.fromBytes = (buf: Uint8Array): [PChainBaseTx, Uint8Array] => {
  let currBuf = buf.slice();
  let json: {
    typeId?: Int;
    networkID?: Int;
    blockchainID?: Bytes;
    outputs?: PChainTransferableOutput[];
    inputs?: PChainTransferableInput[];
    memo?: StringPr;
  } = {};

  for (const {
    key,
    type,
    length,
    elemByteLen,
    isArray,
  } of PChainBaseTxSchema) {
    if (isArray) {
      const [value, rest] = parseTypedArraySchema(currBuf, type);
      json[key as keyof typeof json] = value as any;
      currBuf = rest;
    } else if (key === "memo") {
      const [size, rest] = Int.fromBytes(currBuf);
      const [value, restData] = type.fromBytes(rest, size.value() ?? length);
      json[key as keyof typeof json] = value as any;
      currBuf = restData;
    } else {
      const [value, rest] = type.fromBytes(currBuf, length ?? elemByteLen);
      json[key as keyof typeof json] = value;
      currBuf = rest;
    }
  }
  return [PChainBaseTx(json as any) as any, currBuf];
};

PChainBaseTx.typeId = "0";
