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
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const delegatorTx = await client.pChain.prepareAddPermissionlessDelegatorTxn({
   *   stakeInAvax: 1000,
   *   nodeId: "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5",
   *   end: 1735689600,
   *   rewardAddresses: ["P-avax1j2zllfqv4mgg7ytn9m2u2x0q3h3jqkzq8q8q8q8"]
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
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const validatorTx = await client.pChain.prepareAddPermissionlessValidatorTxn({
   *   stakeInAvax: 2000,
   *   nodeId: "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5",
   *   end: 1735689600,
   *   rewardAddresses: ["P-avax1j2zllfqv4mgg7ytn9m2u2x0q3h3jqkzq8q8q8q8"],
   *   delegatorRewardAddresses: ["P-avax1j2zllfqv4mgg7ytn9m2u2x0q3h3jqkzq8q8q8q8"],
   *   delegatorRewardPercentage: 2
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
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const subnetValidatorTx = await client.pChain.prepareAddSubnetValidatorTxn({
   *   subnetId: "2bRCr6B4MiEfSiSjC8P7gQipqQK3VKQwNqsTq5QfbVS6qPfrjR",
   *   nodeId: "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5",
   *   weight: 1000000000000n,
   *   end: 1735689600n,
   *   subnetAuth: [0]
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
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const baseTx = await client.pChain.prepareBaseTxn({
   *   outputs: [{
   *     address: "P-avax1j2zllfqv4mgg7ytn9m2u2x0q3h3jqkzq8q8q8q8",
   *     amount: 1000000000n,
   *     assetId: "AVAX"
   *   }]
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
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const convertSubnetTx = await client.pChain.prepareConvertSubnetToL1Txn({
   *   subnetId: "2bRCr6B4MiEfSiSjC8P7gQipqQK3VKQwNqsTq5QfbVS6qPfrjR",
   *   subnetAuth: [0]
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
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheWalletClient({
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
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const createSubnetTx = await client.pChain.prepareCreateSubnetTxn({
   *   subnetOwners: {
   *     addresses: ["P-avax1j2zllfqv4mgg7ytn9m2u2x0q3h3jqkzq8q8q8q8"],
   *     threshold: 1
   *   }
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
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const disableValidatorTx = await client.pChain.prepareDisableL1ValidatorTxn({
   *   nodeId: "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5",
   *   subnetAuth: [0]
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
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const exportTx = await client.pChain.prepareExportTxn({
   *   destinationChain: "X",
   *   exportedOutputs: [{
   *     address: "X-avax1j2zllfqv4mgg7ytn9m2u2x0q3h3jqkzq8q8q8q8",
   *     amount: 1
   *   }]
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
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const importTx = await client.pChain.prepareImportTxn({
   *   sourceChain: "X",
   *   importedOutput: {
   *     addresses: ["P-avax1j2zllfqv4mgg7ytn9m2u2x0q3h3jqkzq8q8q8q8"]
   *   }
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
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const increaseBalanceTx = await client.pChain.prepareIncreaseL1ValidatorBalanceTxn({
   *   nodeId: "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5",
   *   subnetAuth: [0]
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
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const registerValidatorTx = await client.pChain.prepareRegisterL1ValidatorTx({
   *   nodeId: "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5",
   *   subnetAuth: [0]
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
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const removeValidatorTx = await client.pChain.prepareRemoveSubnetValidatorTx({
   *   subnetId: "2bRCr6B4MiEfSiSjC8P7gQipqQK3VKQwNqsTq5QfbVS6qPfrjR",
   *   nodeId: "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5",
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
   * @param args - {@link PrepareSetL1ValidatorWeightTxParameters}
   * @returns Set L1 validator weight transaction data. {@link PrepareSetL1ValidatorWeightTxReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheWalletClient } from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheWalletClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const setWeightTx = await client.pChain.prepareSetL1ValidatorWeightTxn
   *   nodeId: "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5",
   *   weight: 1000000000000n,
   *   subnetAuth: [0]
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
