import {
  Common,
  Context as ContextType,
  PChainOwner,
  pvmSerial,
} from "@avalabs/avalanchejs";
import { CommonTxParams } from "../../types/common.js";
import { PChainOwnerJSON } from "../../utils.js";

/**
 * P-Chain owner information
 */
export type PChainOwnerInfo = {
  /**
   * Array of addresses that can sign.
   */
  addresses: string[];
  /**
   * Threshold of signatures required.
   */
  threshold: number;
};

export type PrepareConvertSubnetToL1TxnParameters = CommonTxParams & {
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
   * {@link L1Validator[]}
   */
  validators: L1Validator[];
  /**
   * Array of indices from the subnet's owners array
   * who will sign this `ConvertSubnetToL1Tx`.
   */
  subnetAuth: readonly number[];
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
   */
  context?: ContextType.Context;
};

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
  };
  /**
   * Weight of the validator on the L1 used during the consensus participation.
   */
  weight: bigint;
  /**
   * Initial balance (in nAVAX) of the L1 validator required for paying
   * a contiguous fee to the Primary Network to validate the L1.
   */
  initialBalanceInAvax: bigint;
  /**
   * Owner information to which the remaining L1 validator balance will be assigned, in case
   * the validator is removed or disabled from the L1 validator set.
   */
  remainingBalanceOwner: PChainOwnerJSON;
  /**
   * Owner information which can remove or disable the validator
   * from the L1 validator set.
   */
  deactivationOwner: PChainOwnerJSON;
};

export type PrepareConvertSubnetToL1TxnReturnType = {
  /**
   * The unsigned transaction.
   */
  tx: Common.UnsignedTx;
  /**
   * The convert subnet to L1 transaction instance.
   */
  convertSubnetToL1Tx: pvmSerial.ConvertSubnetToL1Tx;
  /**
   * The subnet owners.
   */
  subnetOwners: PChainOwner;
  /**
   * The subnet auth.
   */
  subnetAuth: number[];
  /**
   * The chain alias.
   */
  chainAlias: "P";
};
