import { type Context as ContextType, pvm, type pvmSerial, utils} from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import { Transaction } from "../common/transaction";
import type { CommonTxParams, NewTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";

export type CreateSubnetTxParams = CommonTxParams & {
    subnetOwners: SubnetOwners;
}

export type SubnetOwners = {
    addresses: string[];
    threshold?: number;
    locktime?: bigint;
}

export class CreateSubnetTx extends Transaction {
    override tx: pvmSerial.CreateSubnetTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.CreateSubnetTx
    }
}

export async function newCreateSubnetTx(
    params: CreateSubnetTxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): Promise<CreateSubnetTx> {
    const commonTxParams = await fetchCommonTxParams(params, context, pvmRpc, wallet)

    const formattedSubnetOwnerAddresses = params.subnetOwners.addresses.map(utils.bech32ToBytes)

    const unsignedTx = pvm.newCreateSubnetTx({
        ...commonTxParams,
        subnetOwners: formattedSubnetOwnerAddresses,
        locktime: params.subnetOwners.locktime ?? 0n,
        threshold: params.subnetOwners.threshold ?? 1
    }, context)
    return new CreateSubnetTx({ unsignedTx, pvmRpc, nodeUrl, wallet })
}
