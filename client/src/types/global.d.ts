// Type augmentation for viem's Block module to use Avalanche-specific Block type
import "viem";
import type { BlockTag, Transaction } from "viem";
import type { Block as AvalancheBlock } from "./block.js";

declare module "viem" {
  export type Block<
    quantity = bigint,
    includeTransactions extends boolean = boolean,
    blockTag extends BlockTag = BlockTag,
    transaction = Transaction<
      bigint,
      number,
      blockTag extends "pending" ? true : false
    >
  > = AvalancheBlock<quantity, includeTransactions, blockTag, transaction>;
}

export {};
