import { Chain, Transport } from "viem";
import {
  PrepareAddPermissionlessDelegatorTxnParameters,
  PrepareAddPermissionlessDelegatorTxnReturnType,
  PrepareAddPermissionlessValidatorTxnParameters,
  PrepareAddPermissionlessValidatorTxnReturnType,
  PrepareAddSubnetValidatorTxnParameters,
  PrepareAddSubnetValidatorTxnReturnType,
  PrepareBaseTxnParameters,
  PrepareBaseTxnReturnType,
  PrepareConvertSubnetToL1TxnParameters,
  PrepareConvertSubnetToL1TxnReturnType,
  PrepareCreateChainTxnParameters,
  PrepareCreateChainTxnReturnType,
  PrepareCreateSubnetTxnParameters,
  PrepareCreateSubnetTxnReturnType,
  PrepareDisableL1ValidatorTxnParameters,
  PrepareDisableL1ValidatorTxnReturnType,
  PrepareExportTxnParameters,
  PrepareExportTxnReturnType,
  PrepareImportTxnParameters,
  PrepareImportTxnReturnType,
  PrepareIncreaseL1ValidatorBalanceTxnParameters,
  PrepareIncreaseL1ValidatorBalanceTxnReturnType,
  PrepareRegisterL1ValidatorTxnParameters,
  PrepareRegisterL1ValidatorTxnReturnType,
  PrepareRemoveSubnetValidatorTxnParameters,
  PrepareRemoveSubnetValidatorTxnReturnType,
  PrepareSetL1ValidatorWeightTxnParameters,
  PrepareSetL1ValidatorWeightTxnReturnType,
  prepareExportTxn,
  prepareImportTxn,
  prepareSetL1ValidatorWeightTxn,
} from "../../methods/wallet/pChain/index.js";
import { prepareAddPermissionlessDelegatorTxn } from "../../methods/wallet/pChain/prepareAddPermissionlessDelegatorTxn.js";
import { prepareAddPermissionlessValidatorTxn } from "../../methods/wallet/pChain/prepareAddPermissionlessValidatorTxn.js";
import { prepareAddSubnetValidatorTxn } from "../../methods/wallet/pChain/prepareAddSubnetValidatorTxn.js";
import { prepareBaseTxn } from "../../methods/wallet/pChain/prepareBaseTxn.js";
import { prepareConvertSubnetToL1Txn } from "../../methods/wallet/pChain/prepareConvertSubnetToL1Txn.js";
import { prepareCreateChainTxn } from "../../methods/wallet/pChain/prepareCreateChainTxn.js";
import { prepareCreateSubnetTxn } from "../../methods/wallet/pChain/prepareCreateSubnetTxn.js";
import { prepareDisableL1ValidatorTxn } from "../../methods/wallet/pChain/prepareDisableL1ValidatorTxn.js";
import { prepareIncreaseL1ValidatorBalanceTxn } from "../../methods/wallet/pChain/prepareIncreaseL1ValidatorBalanceTxn.js";
import { prepareRegisterL1ValidatorTxn } from "../../methods/wallet/pChain/prepareRegisterL1ValidatorTxn.js";
import { prepareRemoveSubnetValidatorTxn } from "../../methods/wallet/pChain/prepareRemoveSubnetValidatorTxn.js";
import { AvalancheWalletCoreClient } from "../createAvalancheWalletCoreClient.js";

export type PChainWalletActions = {
  /**
   * Prepare an add permissionless delegator transaction.
   * This method creates the transaction data needed to delegate AVAX to a permissionless validator.
   *
   * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-add-permissionless-delegator-tx
   *
   * @param args - {@link PrepareAddPermissionlessDelegatorTxnParameters}
   * @returns Delegator transaction data. {@link PrepareAddPermissionlessDelegatorTxnReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { privateKeyToAvalancheAccount } from '@avalanche-sdk/client/accounts'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   * import { avaxToNanoAvax } from '@avalanche-sdk/client/utils'
   *
   * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const delegatorTx = await client.pChain.prepareAddPermissionlessDelegatorTxn({
   *   nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
   *   stakeInAvax: avaxToNanoAvax(1),
   *   end: 1716441600n,
   *   rewardAddresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
   *   threshold: 1,
   * })
   * ```
   */
  prepareAddPermissionlessDelegatorTxn: (
    args: PrepareAddPermissionlessDelegatorTxnParameters
  ) => Promise<PrepareAddPermissionlessDelegatorTxnReturnType>;

  /**
   * Prepare an add permissionless validator transaction.
   * This method creates the transaction data needed to add a permissionless validator.
   *
   * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-add-permissionless-validator-tx
   *
   * @param args - {@link PrepareAddPermissionlessValidatorTxnParameters}
   * @returns Validator transaction data. {@link PrepareAddPermissionlessValidatorTxnReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { privateKeyToAvalancheAccount } from '@avalanche-sdk/client/accounts'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   * import { avaxToNanoAvax } from '@avalanche-sdk/client/utils'
   *
   * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const validatorTx = await client.pChain.prepareAddPermissionlessValidatorTxn({
   *   nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
   *   stakeInAvax: avaxToNanoAvax(1),
   *   end: 1716441600n,
   *   rewardAddresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
   *   threshold: 1,
   *   publicKey: "0x1234567890123456789012345678901234567890",
   *   signature: "0x1234567890123456789012345678901234567890",
   *   locktime: 1716441600,
   *   delegatorRewardPercentage: 2.5,
   *   delegatorRewardAddresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
   * })
   * ```
   */
  prepareAddPermissionlessValidatorTxn: (
    args: PrepareAddPermissionlessValidatorTxnParameters
  ) => Promise<PrepareAddPermissionlessValidatorTxnReturnType>;

  /**
   * Prepare an add subnet validator transaction.
   * This method creates the transaction data needed to add a validator to a subnet.
   *
   * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-add-subnet-validator-tx
   *
   * @param args - {@link PrepareAddSubnetValidatorTxnParameters}
   * @returns Subnet validator transaction data. {@link PrepareAddSubnetValidatorTxnReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { privateKeyToAvalancheAccount } from '@avalanche-sdk/client/accounts'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const subnetValidatorTx = await client.pChain.prepareAddSubnetValidatorTxn({
   *   subnetId: "11111111111111111111111111111111LpoYY",
   *   nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
   *   weight: 1n,
   *   end: 1716441600n,
   *   subnetAuth: [1],
   * })
   * ```
   */
  prepareAddSubnetValidatorTxn: (
    args: PrepareAddSubnetValidatorTxnParameters
  ) => Promise<PrepareAddSubnetValidatorTxnReturnType>;

  /**
   * Prepare a base transaction.
   * This method creates the transaction data for a basic P-Chain transaction.
   *
   * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-base-tx
   *
   * @param args - {@link PrepareBaseTxnParameters}
   * @returns Base transaction data. {@link PrepareBaseTxnReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { privateKeyToAvalancheAccount } from '@avalanche-sdk/client/accounts'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   * import { avaxToNanoAvax } from '@avalanche-sdk/client/utils'
   *
   * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const baseTx = await client.pChain.prepareBaseTxn({
   *   outputs: [{
   *     addresses: "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz",
   *     amount: avaxToNanoAvax(1),
   *   }],
   * })
   * ```
   */
  prepareBaseTxn: (
    args: PrepareBaseTxnParameters
  ) => Promise<PrepareBaseTxnReturnType>;

  /**
   * Prepare a convert subnet to L1 transaction.
   * This method creates the transaction data needed to convert a subnet to L1.
   *
   * - Docs: https://build.avax.network/docs/api-reference/p-chain/txn-format#convertsubnettol1tx
   *
   * @param args - {@link PrepareConvertSubnetToL1TxnParameters}
   * @returns Convert subnet to L1 transaction data. {@link PrepareConvertSubnetToL1TxnReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { privateKeyToAvalancheAccount } from '@avalanche-sdk/client/accounts'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   * import { avaxToNanoAvax } from '@avalanche-sdk/client/utils'
   *
   * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const convertSubnetTx = await client.pChain.prepareConvertSubnetToL1Txn({
   *   subnetId: "11111111111111111111111111111111LpoYY",
   *   blockchainId: 1,
   *   managerContractAddress: "0x1234567890123456789012345678901234567890",
   *   subnetAuth: [1],
   *   validators: [
   *     {
   *       nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
   *       weight: 1n,
   *       initialBalanceInAvax: avaxToNanoAvax(1),
   *       nodePoP: {
   *         publicKey: "0x1234567890123456789012345678901234567890",
   *         proofOfPossession: "0x1234567890123456789012345678901234567890",
   *       },
   *       remainingBalanceOwner: {
   *         addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
   *         threshold: 1,
   *       },
   *       deactivationOwner: {
   *         addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
   *         threshold: 1,
   *       },
   *     },
   *   ],
   * })
   * ```
   */
  prepareConvertSubnetToL1Txn: (
    args: PrepareConvertSubnetToL1TxnParameters
  ) => Promise<PrepareConvertSubnetToL1TxnReturnType>;

  /**
   * Prepare a create chain transaction.
   * This method creates the transaction data needed to create a new chain on a subnet.
   *
   * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-create-chain-tx
   *
   * @param args - {@link PrepareCreateChainTxnParameters}
   * @returns Create chain transaction data. {@link PrepareCreateChainTxnReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { privateKeyToAvalancheAccount } from '@avalanche-sdk/client/accounts'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const createChainTx = await client.pChain.prepareCreateChainTxn({
   *   subnetId: "2bRCr6B4MiEfSiSjC8P7gQipqQK3VKQwNqsTq5QfbVS6qPfrjR",
   *   chainName: "MyChain",
   *   vmId: "rWmFif9Jg32JR6mw3KhZfnVo7Z63PNkM",
   *   fxIds: ["rWmFif9Jg32JR6mw3KhZfnVo7Z63PNkM"],
   *   genesisData: "0x...",
   *   subnetAuth: [0]
   * })
   * ```
   */
  prepareCreateChainTxn: (
    args: PrepareCreateChainTxnParameters
  ) => Promise<PrepareCreateChainTxnReturnType>;

  /**
   * Prepare a create subnet transaction.
   * This method creates the transaction data needed to create a new subnet.
   *
   * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-create-subnet-tx
   *
   * @param args - {@link PrepareCreateSubnetTxnParameters}
   * @returns Create subnet transaction data. {@link PrepareCreateSubnetTxnReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { privateKeyToAvalancheAccount } from '@avalanche-sdk/client/accounts'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const createSubnetTx = await client.pChain.prepareCreateSubnetTxn({
   *   subnetOwners: {
   *     addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
   *     threshold: 1,
   *   },
   * })
   * ```
   */
  prepareCreateSubnetTxn: (
    args: PrepareCreateSubnetTxnParameters
  ) => Promise<PrepareCreateSubnetTxnReturnType>;

  /**
   * Prepare a disable L1 validator transaction.
   * This method creates the transaction data needed to disable an L1 validator.
   *
   * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-disable-l1-validator-tx
   *
   * @param args - {@link PrepareDisableL1ValidatorTxnParameters}
   * @returns Disable L1 validator transaction data. {@link PrepareDisableL1ValidatorTxnReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { privateKeyToAvalancheAccount } from '@avalanche-sdk/client/accounts'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const disableValidatorTx = await client.pChain.prepareDisableL1ValidatorTxn({
   *   validationId: "11111111111111111111111111111111LpoYY",
   *   disableAuth: [0],
   * })
   * ```
   */
  prepareDisableL1ValidatorTxn: (
    args: PrepareDisableL1ValidatorTxnParameters
  ) => Promise<PrepareDisableL1ValidatorTxnReturnType>;

  /**
   * Prepare an export transaction from P-Chain to another chain (X-Chain or C-Chain).
   * This method creates the transaction data needed to export AVAX from the P-Chain.
   *
   * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-export-tx
   *
   * @param args - {@link PrepareExportTxnParameters}
   * @returns Export transaction data. {@link PrepareExportTxnReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { privateKeyToAvalancheAccount } from '@avalanche-sdk/client/accounts'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   * import { avaxToNanoAvax } from '@avalanche-sdk/client/utils'
   *
   * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const exportTx = await client.pChain.prepareExportTxn({
   *   destinationChain: "P",
   *   exportedOutputs: [{
   *     addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
   *     amount: avaxToNanoAvax(0.0001),
   *   }],
   * })
   * ```
   */
  prepareExportTxn: (
    args: PrepareExportTxnParameters
  ) => Promise<PrepareExportTxnReturnType>;

  /**
   * Prepare an import transaction from another chain (X-Chain or C-Chain) to P-Chain.
   * This method creates the transaction data needed to import AVAX to the P-Chain.
   *
   * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-import-tx
   *
   * @param args - {@link PrepareImportTxnParameters}
   * @returns Import transaction data. {@link PrepareImportTxnReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { privateKeyToAvalancheAccount } from '@avalanche-sdk/client/accounts'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const pChainImportTxnRequest = await client.pChain.prepareImportTxn({
   *   sourceChain: "C",
   *   importedOutput: {
   *     addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
   *   },
   * })
   * ```
   */
  prepareImportTxn: (
    args: PrepareImportTxnParameters
  ) => Promise<PrepareImportTxnReturnType>;

  /**
   * Prepare an increase L1 validator balance transaction.
   * This method creates the transaction data needed to increase an L1 validator's balance.
   *
   * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-increase-l1-validator-balance-tx
   *
   * @param args - {@link PrepareIncreaseL1ValidatorBalanceTxnParameters}
   * @returns Increase L1 validator balance transaction data. {@link PrepareIncreaseL1ValidatorBalanceTxnReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { privateKeyToAvalancheAccount } from '@avalanche-sdk/client/accounts'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const pChainIncreaseL1ValidatorBalanceTxnRequest = await client.pChain.prepareIncreaseL1ValidatorBalanceTxn({
   *   balanceInAvax: avaxToNanoAvax(1),
   *   validationId: "11111111111111111111111111111111LpoYY",
   * })
   * ```
   */
  prepareIncreaseL1ValidatorBalanceTxn: (
    args: PrepareIncreaseL1ValidatorBalanceTxnParameters
  ) => Promise<PrepareIncreaseL1ValidatorBalanceTxnReturnType>;

  /**
   * Prepare a register L1 validator transaction.
   * This method creates the transaction data needed to register an L1 validator.
   *
   * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-register-l1-validator-tx
   *
   * @param args - {@link PrepareRegisterL1ValidatorTxnParameters}
   * @returns Register L1 validator transaction data. {@link PrepareRegisterL1ValidatorTxnReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { privateKeyToAvalancheAccount } from '@avalanche-sdk/client/accounts'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   * import { avaxToNanoAvax } from '@avalanche-sdk/client/utils'
   *
   * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const pChainRegisterL1ValidatorTxnRequest = await client.pChain.prepareRegisterL1ValidatorTxn({
   *   initialBalanceInAvax: avaxToNanoAvax(1),
   *   blsSignature: "0x1234567890123456789012345678901234567890",
   *   message: "0x1234567890123456789012345678901234567890",
   * })
   * ```
   */
  prepareRegisterL1ValidatorTxn: (
    args: PrepareRegisterL1ValidatorTxnParameters
  ) => Promise<PrepareRegisterL1ValidatorTxnReturnType>;

  /**
   * Prepare a remove subnet validator transaction.
   * This method creates the transaction data needed to remove a validator from a subnet.
   *
   * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-remove-subnet-validator-tx
   *
   * @param args - {@link PrepareRemoveSubnetValidatorTxnParameters}
   * @returns Remove subnet validator transaction data. {@link PrepareRemoveSubnetValidatorTxnReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { privateKeyToAvalancheAccount } from '@avalanche-sdk/client/accounts'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const pChainRemoveSubnetValidatorTxnRequest = await client.pChain.prepareRemoveSubnetValidatorTxn({
   *   subnetId: "2bRCr6B4MiEfSiSjC8P7gQipqQK3VKQwNqsTq5QfbVS6qPfrjR",
   *   nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
   *   subnetAuth: [0]
   * })
   * ```
   */
  prepareRemoveSubnetValidatorTxn: (
    args: PrepareRemoveSubnetValidatorTxnParameters
  ) => Promise<PrepareRemoveSubnetValidatorTxnReturnType>;

  /**
   * Prepare a set L1 validator weight transaction.
   * This method creates the transaction data needed to set an L1 validator's weight.
   *
   * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-set-l1-validator-weight-tx
   *
   * @param args - {@link PrepareSetL1ValidatorWeightTxnParameters}
   * @returns Set L1 validator weight transaction data. {@link PrepareSetL1ValidatorWeightTxnReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { privateKeyToAvalancheAccount } from '@avalanche-sdk/client/accounts'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890")
   * const client = createAvalancheWalletClient({
   *   account,
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const pChainSetL1ValidatorWeightTxnRequest = await client.pChain.prepareSetL1ValidatorWeightTxn({
   *   message: "0x1234567890123456789012345678901234567890",
   * })
   * ```
   */
  prepareSetL1ValidatorWeightTxn: (
    args: PrepareSetL1ValidatorWeightTxnParameters
  ) => Promise<PrepareSetL1ValidatorWeightTxnReturnType>;
};

export function pChainWalletActions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheWalletCoreClient<Transport, chain>): PChainWalletActions {
  return {
    prepareAddPermissionlessDelegatorTxn: (args) =>
      prepareAddPermissionlessDelegatorTxn(client, args),
    prepareAddPermissionlessValidatorTxn: (args) =>
      prepareAddPermissionlessValidatorTxn(client, args),
    prepareAddSubnetValidatorTxn: (args) =>
      prepareAddSubnetValidatorTxn(client, args),
    prepareBaseTxn: (args) => prepareBaseTxn(client, args),
    prepareConvertSubnetToL1Txn: (args) =>
      prepareConvertSubnetToL1Txn(client, args),
    prepareCreateChainTxn: (args) => prepareCreateChainTxn(client, args),
    prepareCreateSubnetTxn: (args) => prepareCreateSubnetTxn(client, args),
    prepareDisableL1ValidatorTxn: (args) =>
      prepareDisableL1ValidatorTxn(client, args),
    prepareExportTxn: (args) => prepareExportTxn(client, args),
    prepareImportTxn: (args) => prepareImportTxn(client, args),
    prepareIncreaseL1ValidatorBalanceTxn: (args) =>
      prepareIncreaseL1ValidatorBalanceTxn(client, args),
    prepareRegisterL1ValidatorTxn: (args) =>
      prepareRegisterL1ValidatorTxn(client, args),
    prepareRemoveSubnetValidatorTxn: (args) =>
      prepareRemoveSubnetValidatorTxn(client, args),
    prepareSetL1ValidatorWeightTxn: (args) =>
      prepareSetL1ValidatorWeightTxn(client, args),
  };
}
