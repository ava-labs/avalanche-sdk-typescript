import { Chain, Transport } from "viem";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";
import { GetContainerByIndexReturnType } from "../../methods/index/types/getContainerByIndex.js";
import { GetContainerByIDParameters } from "../../methods/index/types/getContainerByID.js";
import { GetContainerByIDReturnType } from "../../methods/index/types/getContainerByID.js";
import { GetContainerByIndexParameters } from "../../methods/index/types/getContainerByIndex.js";
import { GetContainerRangeReturnType } from "../../methods/index/types/getContainerRange.js";
import { GetContainerRangeParameters } from "../../methods/index/types/getContainerRange.js";
import { GetIndexParameters } from "../../methods/index/types/getIndex.js";
import { GetIndexReturnType } from "../../methods/index/types/getIndex.js";
import { GetLastAcceptedReturnType } from "../../methods/index/types/getLastAccepted.js";
import { GetLastAcceptedParameters } from "../../methods/index/types/getLastAccepted.js";
import { IsAcceptedReturnType } from "../../methods/index/types/isAccepted.js";
import { IsAcceptedParameters } from "../../methods/index/types/isAccepted.js";
import { getContainerByID } from "../../methods/index/getContainerByID.js";
import { getContainerByIndex } from "../../methods/index/getContainerByIndex.js";
import { getContainerRange } from "../../methods/index/getContainerRange.js";
import { getIndex } from "../../methods/index/getIndex.js";
import { getLastAccepted } from "../../methods/index/getLastAccepted.js";
import { isAccepted } from "../../methods/index/isAccepted.js";

export type IndexAPIActions = {
  getContainerByID: (
    args: GetContainerByIDParameters
  ) => Promise<GetContainerByIDReturnType>;
  getContainerByIndex: (
    args: GetContainerByIndexParameters
  ) => Promise<GetContainerByIndexReturnType>;
  getContainerRange: (
    args: GetContainerRangeParameters
  ) => Promise<GetContainerRangeReturnType>;
  getIndex: (args: GetIndexParameters) => Promise<GetIndexReturnType>;
  getLastAccepted: (args: GetLastAcceptedParameters) => Promise<GetLastAcceptedReturnType>;
  isAccepted: (args: IsAcceptedParameters) => Promise<IsAcceptedReturnType>;
};

export function indexAPIActions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheCoreClient<Transport, chain>): IndexAPIActions {
  return {
    getContainerByID: (args) => getContainerByID(client, args),
    getContainerByIndex: (args) => getContainerByIndex(client, args),
    getContainerRange: (args) => getContainerRange(client, args),
    getIndex: (args) => getIndex(client, args),
    getLastAccepted: (args) => getLastAccepted(client, args),
    isAccepted: (args) => isAccepted(client, args),
  };
}
