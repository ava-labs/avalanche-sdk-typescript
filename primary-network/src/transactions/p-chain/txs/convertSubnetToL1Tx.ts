import {
    L1Validator as FormattedL1Validator,
    PChainOwner as FormattedPChainOwner,
    pvm,
    pvmSerial,
    utils
} from "@avalabs/avalanchejs";
import type { CommonTxParams, PChainOwner } from "../common/types";
import { bech32AddressToBytes, avaxToNanoAvax, fetchCommonTxParams } from "../common/utils";
import { SubnetTransaction, type SubnetTransactionParams } from "./subnetTransactions";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type ConvertSubnetToL1TxParams = CommonTxParams & {
    /**
     * Subnet ID of the subnet to convert to an L1.
     */
    subnetId: string;
    /**
     * Blockchain ID of the L1 where the validator manager contract is deployed.
     */
    blockchainId: string;
    /**
     * Address of the validator manager contract.
     */
    managerContractAddress: string;
    /**
     * Initial set of L1 validators after the conversion.
     */
    validators: L1Validator[];
    /**
     * Array of indices from the subnet's owners array
     * who will sign this `ConvertSubnetToL1Tx`.
     */
    subnetAuth: number[];
}

/**
 * L1 validator
 */
export type L1Validator = {
    /**
     * Node ID of the validator.
     */
    nodeId: string;
    /**
     * Proof of possession of the validator.
     */
    nodePoP: {
        /**
         * Public key of the validator.
         */
        publicKey: string;
        /**
         * Proof of possession of the public key.
         */
        proofOfPossession: string;
    }
    /**
     * Weight of the validator on the L1 used during the consensus participation.
     */
    weight: bigint;
    /**
     * Initial balance (in AVAX) of the L1 validator required for paying
     * a contiguous fee to the Primary Network to validate the L1.
     */
    initialBalanceInAvax: number;
    /**
     * Owner information to which the remaining L1 validator balance will be assigned, in case
     * the validator is removed or disabled from the L1 validator set.
     */
    remainingBalanceOwner: PChainOwner;
    /**
     * Owner information which can remove or disable the validator
     * from the L1 validator set.
     */
    deactivationOwner: PChainOwner;
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
        avaxToNanoAvax(validator.initialBalanceInAvax),
        new pvmSerial.ProofOfPossession(
            utils.hexToBuffer(validator.nodePoP.publicKey),
            utils.hexToBuffer(validator.nodePoP.proofOfPossession)
        ),
        FormattedPChainOwner.fromNative(
            validator.remainingBalanceOwner.addresses.map(bech32AddressToBytes),
            validator.remainingBalanceOwner.threshold
        ),
        FormattedPChainOwner.fromNative(
            validator.deactivationOwner.addresses.map(bech32AddressToBytes),
            validator.deactivationOwner.threshold
        )
    ));

    const unsignedTx = pvm.newConvertSubnetToL1Tx({
        ...commonTxParams,
        subnetId: params.subnetId,
        chainId: params.blockchainId,
        address: utils.hexToBuffer(params.managerContractAddress),
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
