import {
    type Context as ContextType,
    L1Validator as FormattedL1Validator,
    PChainOwner as FormattedPChainOwner,
    pvm,
    pvmSerial,
    utils
} from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import { Transaction } from "../common/transaction";
import type { CommonTxParams, NewTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";

export type ConvertSubnetToL1TxParams = CommonTxParams & {
    subnetId: string;
    blockchainId: string;
    managerContractAddress: string;
    subnetAuth: number[];
    validators: L1Validator[];
}

export type L1Validator = {
    nodeId: string;
    nodePoP: {
        publicKey: string;
        proofOfPossession: string;
    }
    weight: bigint;
    initialBalance: bigint;
    remainingBalanceOwner: PChainOwner;
    deactivationOwner: PChainOwner;
}

export type PChainOwner = {
    addresses: string[];
    threshold: number;
}

export class ConvertSubnetToL1Tx extends Transaction {
    override tx: pvmSerial.ConvertSubnetToL1Tx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.ConvertSubnetToL1Tx
    }
}
export async function newConvertSubnetToL1Tx(
    params: ConvertSubnetToL1TxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): Promise<ConvertSubnetToL1Tx> {
    const commonTxParams = await fetchCommonTxParams(params, context, pvmRpc, wallet)

    const validators: FormattedL1Validator[] = params.validators.map(validator => FormattedL1Validator.fromNative(
        validator.nodeId,
        validator.weight,
        validator.initialBalance,
        new pvmSerial.ProofOfPossession(
            utils.hexToBuffer(validator.nodePoP.publicKey),
            utils.hexToBuffer(validator.nodePoP.proofOfPossession)
        ),
        FormattedPChainOwner.fromNative(
            validator.remainingBalanceOwner.addresses.map(utils.bech32ToBytes),
            validator.remainingBalanceOwner.threshold
        ),
        FormattedPChainOwner.fromNative(
            validator.deactivationOwner.addresses.map(utils.bech32ToBytes),
            validator.deactivationOwner.threshold
        )
    ));

    const unsignedTx = pvm.newConvertSubnetToL1Tx({
        ...commonTxParams,
        subnetId: params.subnetId,
        chainId: params.blockchainId,
        address: utils.bech32ToBytes(params.managerContractAddress),
        subnetAuth: params.subnetAuth,
        validators
    }, context)
    return new ConvertSubnetToL1Tx({ unsignedTx, pvmRpc, nodeUrl, wallet })
}
