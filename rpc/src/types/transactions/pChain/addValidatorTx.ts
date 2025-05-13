import { concatBytes } from "@noble/hashes/utils";
import { addTypeIdToBytes, removeTypeIdFromBytes } from "../../../utils/common";
import { Int } from "../../primitives/int";
import { PChainTransactionTypeSymbols } from "../../typeSymbols";
import { parseTypedArraySchema } from "../parseTypedSchema";
import { TypeSchema } from "../typeSchema";
import { PChainBaseTx } from "./baseTx";
import { PChainOutputOwners } from "./output/outputOwners";
import { PChainTransferableOutput } from "./output/transferableOutput";
import { Validator } from "./utils/validator";
export const PChainAddValidatorTxSchema: TypeSchema = [
  {
    key: "typeId",
    type: Int,
  },
  {
    key: "baseTx",
    type: PChainBaseTx,
  },
  {
    key: "validator",
    type: Validator,
  },
  {
    key: "stake",
    type: PChainTransferableOutput,
    isArray: true,
  },
  {
    key: "rewardsOwner",
    type: PChainOutputOwners,
  },
  {
    key: "shares",
    type: Int,
  },
];

export type PChainAddValidatorTx = {
  _type: PChainTransactionTypeSymbols.AddValidatorTx;
  value: () => {
    typeId: Int;
    baseTx: PChainBaseTx;
    validator: Validator;
    stake: PChainTransferableOutput[];
    rewardsOwner: PChainOutputOwners;
    shares: Int;
  };
  toBytes: () => Uint8Array;
  toJSON: () => object;
  toString: () => string;
  valueOf: () => {
    typeId: Int;
    baseTx: PChainBaseTx;
    validator: Validator;
    stake: PChainTransferableOutput[];
    rewardsOwner: PChainOutputOwners;
    shares: Int;
  };
  [Symbol.toPrimitive](hint: string): string;
};

export const PChainAddValidatorTx = (json: {
  typeId?: number | Int | undefined;
  baseTx: PChainBaseTx;
  validator: Validator;
  stake: PChainTransferableOutput[];
  rewardsOwner: PChainOutputOwners;
  shares: number | Int;
}): PChainAddValidatorTx => {
  const typeId = !json.typeId
    ? Int(12)
    : typeof json.typeId === "number"
    ? Int(json.typeId)
    : json.typeId;
  const shares =
    typeof json.shares === "number" ? Int(json.shares) : json.shares;

  return {
    _type: PChainTransactionTypeSymbols.AddValidatorTx,
    value: () => ({
      typeId: typeId,
      baseTx: json.baseTx,
      validator: json.validator,
      stake: json.stake,
      rewardsOwner: json.rewardsOwner,
      shares: shares,
    }),
    toBytes: () => {
      return concatBytes(
        typeId.toBytes(),
        removeTypeIdFromBytes(json.baseTx.toBytes()),
        json.validator.toBytes(),
        concatBytes(
          Int(json.stake.length).toBytes(),
          ...json.stake.map((e) => e.toBytes())
        ),
        json.rewardsOwner.toBytes(),
        shares.toBytes()
      );
    },
    toJSON: () => {
      return {
        typeId: typeId.toJSON(),
        baseTx: json.baseTx.toJSON(),
        validator: json.validator.toJSON(),
        stake: json.stake.map((e) => e.toJSON()),
        rewardsOwner: json.rewardsOwner.toJSON(),
        shares: shares.toJSON(),
      };
    },
    toString: () => {
      return JSON.stringify({
        typeId: typeId.toString(),
        baseTx: json.baseTx.toString(),
        validator: json.validator.toString(),
        stake: json.stake.map((e) => e.toString()),
        rewardsOwner: json.rewardsOwner.toString(),
        shares: shares.toString(),
      });
    },
    valueOf: () => ({
      typeId: typeId,
      baseTx: json.baseTx,
      validator: json.validator,
      stake: json.stake,
      rewardsOwner: json.rewardsOwner,
      shares: shares,
    }),

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") throw new Error("Cannot convert to number");
      return this.toString();
    },
  };
};

PChainAddValidatorTx.fromBytes = (
  buf: Uint8Array
): [PChainAddValidatorTx, Uint8Array] => {
  let currBuf = buf.slice();
  const json: Record<string, any> = {};
  for (const { key, type, length, isArray } of PChainAddValidatorTxSchema) {
    if (isArray) {
      const [value, rest] = parseTypedArraySchema(currBuf, type);
      json[key as keyof typeof json] = value as any;
      currBuf = rest;
    } else {
      if (key === "baseTx") {
        currBuf = addTypeIdToBytes(currBuf, 0).slice();
      }
      const [value, rest] = type.fromBytes(currBuf, length);
      json[key as keyof typeof json] = value as any;
      currBuf = rest;
    }
  }
  return [PChainAddValidatorTx(json as any), currBuf];
};

PChainAddValidatorTx.typeId = "12";
