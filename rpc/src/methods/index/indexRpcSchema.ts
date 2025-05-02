import { RpcSchemaOverride } from "viem";
import { GetContainerByIDMethod } from "./types/getContainerByID.js";
import { GetContainerByIndexMethod } from "./types/getContainerByIndex.js";
import { GetContainerRangeMethod } from "./types/getContainerRange.js";
import { GetIndexMethod } from "./types/getIndex.js";
import { GetLastAcceptedMethod } from "./types/getLastAccepted.js";
import { IsAcceptedMethod } from "./types/isAccepted.js";

export type IndexMethods = [
  GetContainerByIDMethod,
  GetContainerByIndexMethod,
  GetContainerRangeMethod,
  GetIndexMethod,
  GetLastAcceptedMethod,
  IsAcceptedMethod
];

export type IndexRpcSchema = RpcSchemaOverride & IndexMethods;
