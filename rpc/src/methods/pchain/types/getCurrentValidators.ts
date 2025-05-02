import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.getCurrentValidators` method.
 * Get the current validators of a Subnet.
 * @property subnetID - The Subnet whose current validators are returned. If omitted, returns the current validators of the Primary Network
 * @property nodeIDs - List of the NodeIDs of current validators to request. If omitted, all current validators are returned. If a specified NodeID is not in the set of current validators, it will not be included in the response
 */
export type GetCurrentValidatorsParameters = {
  /**
   * The Subnet whose current validators are returned. If omitted, returns the current validators of the Primary Network.
   */
  subnetID?: Buffer | string;

  /**
   * List of the NodeIDs of current validators to request. If omitted, all current validators are returned. If a specified NodeID is not in the set of current validators, it will not be included in the response.
   */
  nodeIDs?: string[];
};

/**
 * Return type for the `platform.getCurrentValidators` method.
 * @property validators - List of validators for the specified Subnet or the Primary Network
 * @property validators[].accruedDelegateeReward - The accrued delegatee reward for the validator
 * @property validators[].txID - The validator transaction ID
 * @property validators[].startTime - The Unix time when the validator starts validating the Subnet
 * @property validators[].endTime - The Unix time when the validator stops validating the Subnet. Omitted if subnetID is an L1 Subnet
 * @property validators[].stakeAmount - The amount of stake for the validator
 * @property validators[].nodeID - The validator's node ID
 * @property validators[].weight - The validator's weight (stake) when sampling validators
 * @property validators[].validationRewardOwner - Specifies the owner of the potential reward earned from staking. Includes locktime, threshold, and an array of addresses. Omitted if subnetID is not the Primary Network
 * @property validators[].delegationRewardOwner - Specifies the owner of the potential reward earned from delegations. Includes locktime, threshold, and an array of addresses. Omitted if subnetID is not the Primary Network
 * @property validators[].signer - The node's BLS public key and proof of possession. Omitted if the validator doesn't have a BLS public key. Omitted if subnetID is not the Primary Network
 * @property validators[].delegatorCount - The number of delegators on this validator. Omitted if subnetID is not the Primary Network
 * @property validators[].delegatorWeight - The total weight of delegators on this validator. Omitted if subnetID is not the Primary Network
 * @property validators[].potentialReward - The potential reward earned from staking. Omitted if subnetID is not the Primary Network
 * @property validators[].delegationFee - The percent fee this validator charges when others delegate stake to them. Omitted if subnetID is not the Primary Network
 * @property validators[].uptime - The percentage of time the queried node has reported the peer as online and validating the Subnet. Omitted if subnetID is not the Primary Network
 * @property validators[].connected - Indicates if the node is connected and tracks the Subnet. Omitted if subnetID is not the Primary Network
 * @property validators[].delegators - List of delegators to this validator. Omitted if subnetID is not the Primary Network. Omitted unless nodeIDs specifies a single NodeID
 * @property validators[].delegators[].txID - The delegator transaction ID
 * @property validators[].delegators[].startTime - The Unix time when the delegator started
 * @property validators[].delegators[].endTime - The Unix time when the delegator stops
 * @property validators[].delegators[].stakeAmount - The amount of nAVAX this delegator staked
 * @property validators[].delegators[].nodeID - The validating node's node ID
 * @property validators[].delegators[].rewardOwner - Specifies the owner of the potential reward earned from staking. Includes locktime, threshold, and an array of addresses
 * @property validators[].delegators[].potentialReward - The potential reward earned from staking
 */
export type GetCurrentValidatorsReturnType = {
  /**
   * List of validators for the specified Subnet or the Primary Network.
   */
  validators: {
    /**
     * The accrued delegatee reward for the validator.
     */
    accruedDelegateeReward: string;

    /**
     * The validator transaction ID.
     */
    txID: string;

    /**
     * The Unix time when the validator starts validating the Subnet.
     */
    startTime: string;

    /**
     * The Unix time when the validator stops validating the Subnet.
     * Omitted if `subnetID` is an L1 Subnet.
     */
    endTime: string;

    /**
     * The amount of stake for the validator.
     */
    stakeAmount: string;

    /**
     * The validator's node ID.
     */
    nodeID: string;

    /**
     * The validator's weight (stake) when sampling validators.
     */
    weight: string;

    /**
     * Specifies the owner of the potential reward earned from staking.
     * Includes locktime, threshold, and an array of addresses.
     * Omitted if `subnetID` is not the Primary Network.
     */
    validationRewardOwner?: {
      locktime: string;
      threshold: string;
      addresses: string[];
    };

    /**
     * Specifies the owner of the potential reward earned from delegations.
     * Includes locktime, threshold, and an array of addresses.
     * Omitted if `subnetID` is not the Primary Network.
     */
    delegationRewardOwner?: {
      locktime: string;
      threshold: string;
      addresses: string[];
    };

    /**
     * The node's BLS public key and proof of possession.
     * Omitted if the validator doesn't have a BLS public key.
     * Omitted if `subnetID` is not the Primary Network.
     */
    signer?: {
      publicKey: string;
      proofOfPosession: string;
    };

    /**
     * The number of delegators on this validator.
     * Omitted if `subnetID` is not the Primary Network.
     */
    delegatorCount?: string;

    /**
     * The total weight of delegators on this validator.
     * Omitted if `subnetID` is not the Primary Network.
     */
    delegatorWeight?: string;

    /**
     * The potential reward earned from staking.
     * Omitted if `subnetID` is not the Primary Network.
     */
    potentialReward?: string;

    /**
     * The percent fee this validator charges when others delegate stake to them.
     * Omitted if `subnetID` is not the Primary Network.
     */
    delegationFee?: string;

    /**
     * The percentage of time the queried node has reported the peer as online and validating the Subnet.
     * Omitted if `subnetID` is not the Primary Network.
     */
    uptime?: string;

    /**
     * Indicates if the node is connected and tracks the Subnet.
     * Omitted if `subnetID` is not the Primary Network.
     */
    connected?: boolean;

    /**
     * List of delegators to this validator.
     * Omitted if `subnetID` is not the Primary Network.
     * Omitted unless `nodeIDs` specifies a single NodeID.
     */
    delegators?: {
      /**
       * The delegator transaction ID.
       */
      txID: string;

      /**
       * The Unix time when the delegator started.
       */
      startTime: string;

      /**
       * The Unix time when the delegator stops.
       */
      endTime: string;

      /**
       * The amount of nAVAX this delegator staked.
       */
      stakeAmount: string;

      /**
       * The validating node's node ID.
       */
      nodeID: string;

      /**
       * Specifies the owner of the potential reward earned from staking.
       * Includes locktime, threshold, and an array of addresses.
       */
      rewardOwner: {
        locktime: string;
        threshold: string;
        addresses: string[];
      };

      /**
       * The potential reward earned from staking.
       */
      potentialReward: string;
    }[];
  }[];
};

export type GetCurrentValidatorsErrorType = RequestErrorType;

export type GetCurrentValidatorsMethod = {
  Method: "platform.getCurrentValidators";
  Parameters: GetCurrentValidatorsParameters;
  ReturnType: GetCurrentValidatorsReturnType;
};
