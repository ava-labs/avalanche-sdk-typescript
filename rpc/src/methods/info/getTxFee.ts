import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetTxFeeReturnType } from "./types/getTxFee.js";


export async function getTxFee<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
): Promise<GetTxFeeReturnType> {
  const txFee = await client.request<
    InfoRpcSchema,
    { method: "info.getTxFee"; params: {} },
    GetTxFeeReturnType
  >({
    method: "info.getTxFee",
    params: {}, 
  });
  return {
    txFee: BigInt(txFee.txFee),
    createAssetTxFee: BigInt(txFee.createAssetTxFee),
    createSubnetTxFee: BigInt(txFee.createSubnetTxFee),
    transformSubnetTxFee: BigInt(txFee.transformSubnetTxFee),
    createBlockchainTxFee: BigInt(txFee.createBlockchainTxFee),
    addPrimaryNetworkValidatorFee: BigInt(txFee.addPrimaryNetworkValidatorFee),
    addPrimaryNetworkDelegatorFee: BigInt(txFee.addPrimaryNetworkDelegatorFee),
    addSubnetValidatorFee: BigInt(txFee.addSubnetValidatorFee),
    addSubnetDelegatorFee: BigInt(txFee.addSubnetDelegatorFee),
  };
}
