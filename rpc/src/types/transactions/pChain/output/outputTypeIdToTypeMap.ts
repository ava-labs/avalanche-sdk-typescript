import { PChainOutputOwners } from "./outputOwners";
import { PChainTransferOutput } from "./transferOutput";

export const OutputTypeIdToTypeMap = {
  [PChainTransferOutput.typeId]: PChainTransferOutput,
  [PChainOutputOwners.typeId]: PChainOutputOwners,
} as const;
