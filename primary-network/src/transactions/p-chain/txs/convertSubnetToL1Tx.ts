import {
    L1Validator as FormattedL1Validator,
    PChainOwner as FormattedPChainOwner,
    pvm,
    pvmSerial,
    utils
} from "@avalabs/avalanchejs";
import type { CommonTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";
import { SubnetTransaction, type SubnetTransactionParams } from "./subnetTransactions";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

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

export class ConvertSubnetToL1Tx extends SubnetTransaction {
    override tx: pvmSerial.ConvertSubnetToL1Tx;

    constructor(params: SubnetTransactionParams) {
        const subnetTx = params.unsignedTx.getTx() as pvmSerial.ConvertSubnetToL1Tx
        super(params, subnetTx.getSubnetAuth().values())
        this.tx = subnetTx
    }
}

export async function newConvertSubnetToL1Tx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    params: ConvertSubnetToL1TxParams,
): Promise<ConvertSubnetToL1Tx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    const { commonTxParams, subnetOwners } = await fetchCommonTxParams(
        params,
        context,
        primaryNetworkCoreClient.pvmRpc,
        primaryNetworkCoreClient.wallet,
        undefined,
        params.subnetId
    )
    if (!subnetOwners) {
        throw new Error("Subnet owners not found for a Subnet tx")
    }
    
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

    return new ConvertSubnetToL1Tx({
        unsignedTx,
        subnetOwners,
        pvmRpc: primaryNetworkCoreClient.pvmRpc,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        wallet: primaryNetworkCoreClient.wallet,
    })
}
