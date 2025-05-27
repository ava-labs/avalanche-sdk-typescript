import { pvm, type pvmSerial, utils } from "@avalabs/avalanchejs";
import { Transaction } from "../common/transaction";
import type { CommonTxParams, NewTxParams } from "../common/types";
import { bech32AddressToBytes, fetchCommonTxParams } from "../common/utils";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type AddPermissionlessValidatorTxParams = CommonTxParams & {
    /**
     * Amount of AVAX to stake. The staked amount in nAVAX will
     * represent the weight of this validator on the network.
     * This amount will be locked until the end of the staking period.
     * The staked outputs will be consolidated into a single output
     * and owned by the `changeAddresses` or the `fromAddresses` array.
     */
    stakeInAvax: number;
    /**
     * The NodeID of the validator being added.
     */
    nodeId: string;
    /**
     * Optional. The BLS public key (in hex format) of the validator being added.
     */
    publicKey?: string;
    /**
     * Optional. The BLS signature (in hex format) of the validator being added.
     */
    signature?: string;
    /**
     * The Unix time in seconds when the validator will be removed from staking set.
     * (and staked AVAX is returned).
    */
    end: number;
    /**
     * The addresses which will receive the validator rewards. Given addresses
     * will share the reward UTXO.
     */
    rewardAddresses: string[];
    /**
     * The addresses which will receive the delegator fee rewards. Given addresses
     * will share the reward UTXO.
    */
    delegatorRewardAddresses: string[];
    /**
     * The percentage of delegator rewards given to validator or `delegatorRewardAddresses`
     * as a delgation fee. Valid upto 3 decimal places.
     * @max 100 @min 2
     */
    delegatorRewardPercentage: number;
    /**
     * Optional. The number of signatures required to spend the funds in the
     * resultant reward UTXO (both validator and delegator fee rewards).
     * @default 1
     */
    threshold?: number;
    /**
     * Optional. The unix timestamp in seconds after which the reward UTXO
     * can be spent, once they are created after the staking period ends
     * (both validator and delegator fee rewards).
     * @default 0
     */
    locktime?: number;
}

export class AddPermissionlessValidatorTx extends Transaction {
    override tx: pvmSerial.AddPermissionlessValidatorTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.AddPermissionlessValidatorTx
    }

    getStakeOutputs() {
        const transferableOutputs = this.tx.stake
        return transferableOutputs.map((transferableOutput) => {
            return {
                ...transferableOutput,
                output: transferableOutput.output as unknown as pvmSerial.StakeableLockOut
            }
        })
    }
}

export async function newAddPermissionlessValidatorTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    params: AddPermissionlessValidatorTxParams,
): Promise<AddPermissionlessValidatorTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    const commonTxParams = await fetchCommonTxParams(params, context, primaryNetworkCoreClient.pvmRpc, primaryNetworkCoreClient.wallet)

    const unsignedTx = pvm.newAddPermissionlessValidatorTx({
        ...commonTxParams,
        weight: BigInt(params.stakeInAvax * 1e9),
        nodeId: params.nodeId,
        start: 0n, // start time is not relevant after Durango upgrade
        end: BigInt(params.end),
        rewardAddresses: params.rewardAddresses.map(bech32AddressToBytes),
        delegatorRewardsOwner: params.delegatorRewardAddresses.map(bech32AddressToBytes),
        shares: params.delegatorRewardPercentage * 10000,
        threshold: params.threshold ?? 1,
        locktime: BigInt(params.locktime ?? 0n),
        // accept only Primary Network staking for permissionless validators
        subnetId: '11111111111111111111111111111111LpoYY',
        // publicKey and signature params don't accept undefined passed explicitly
        ...(params.publicKey ? { publicKey: utils.hexToBuffer(params.publicKey) } : {}),
        ...(params.signature ? { signature: utils.hexToBuffer(params.signature) } : {})
    }, context)

    return new AddPermissionlessValidatorTx({
        unsignedTx,
        pvmRpc: primaryNetworkCoreClient.pvmRpc,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        wallet: primaryNetworkCoreClient.wallet,
    })
}
