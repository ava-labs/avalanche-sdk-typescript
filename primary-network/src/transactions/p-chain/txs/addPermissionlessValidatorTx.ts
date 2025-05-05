import { type Context as ContextType, pvm, type pvmSerial, utils } from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import { Transaction } from "../common/transaction";
import type { CommonTxParams, NewTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";

export type AddPermissionlessValidatorTxParams = CommonTxParams & {
    stakeInAvax: number;
    nodeId: string;
    publicKey?: string;
    signature?: string;
    end: number;
    rewardAddresses: string[];
    delegatorRewardAddresses: string[];
    delegatorRewardPercentage: number;
    threshold?: number;
    locktime?: number;
}

export class AddPermissionlessValidatorTx extends Transaction {
    override tx: pvmSerial.AddPermissionlessValidatorTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.AddPermissionlessValidatorTx
    }
}

export async function newAddPermissionlessValidatorTx(
    params: AddPermissionlessValidatorTxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): Promise<AddPermissionlessValidatorTx> {
    const commonTxParams = await fetchCommonTxParams(params, context, pvmRpc, wallet)

    const unsignedTx = pvm.newAddPermissionlessValidatorTx({
        ...commonTxParams,
        weight: BigInt(params.stakeInAvax * 1e9),
        nodeId: params.nodeId,
        publicKey: params.publicKey ? utils.hexToBuffer(params.publicKey) : new Uint8Array(),
        signature: params.signature ? utils.hexToBuffer(params.signature) : new Uint8Array(),
        start: 0n, // start time is not relevant after Durango upgrade
        end: BigInt(params.end),
        rewardAddresses: params.rewardAddresses.map(address => utils.hexToBuffer(address)),
        delegatorRewardsOwner: params.delegatorRewardAddresses.map(address => utils.hexToBuffer(address)),
        shares: params.delegatorRewardPercentage * 10000,
        threshold: params.threshold ?? 1,
        locktime: BigInt(params.locktime ?? 0n),
        subnetId: '11111111111111111111111111111111LpoYY' // accept only Primary Network staking for permissionless validators
    }, context)
    return new AddPermissionlessValidatorTx({ unsignedTx, pvmRpc, nodeUrl, wallet })
}
