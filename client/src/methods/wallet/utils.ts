import {
  Address,
  avaxSerial,
  Context as ContextType,
  Int,
  PChainOwner,
  pvmSerial,
  TransferableOutput,
  utils,
} from "@avalabs/avalanchejs";
import { getUtxosForAddress } from "src/utils/index.js";
import { Address as AddressType } from "viem";
import {
  AvalancheAccount,
  parseAvalancheAccount,
  publicKeyToXPAddress,
} from "../../accounts/index.js";
import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import {
  C_CHAIN_ALIAS,
  C_CHAIN_FUJI_ID,
  C_CHAIN_MAINNET_ID,
  MAINNET_NETWORK_ID,
  P_CHAIN_ALIAS,
  P_CHAIN_FUJI_ID,
  P_CHAIN_MAINNET_ID,
  TESTNET_NETWORK_ID,
  X_CHAIN_ALIAS,
  X_CHAIN_FUJI_ID,
  X_CHAIN_MAINNET_ID,
} from "../consts.js";
import { getFeeState } from "../pChain/getFeeState.js";
import { getL1Validator } from "../pChain/getL1Validator.js";
import { getTx } from "../pChain/getTx.js";
import {
  CommonTxParams,
  FormattedCommonTxParams,
  Output,
} from "./types/common.js";
export function getBaseUrl(client: AvalancheWalletCoreClient): string {
  const { chain } = client;
  const configUrl = chain?.rpcUrls?.default?.http[0];

  if (!configUrl) {
    throw new Error("RPC URL not found");
  }

  return new URL(configUrl).origin;
}

export function getBech32AddressFromAccountOrClient(
  client: AvalancheWalletCoreClient, // TODO: use this to fetch the default account
  account: AvalancheAccount | AddressType | undefined,
  hrp: string
): string {
  const xpAcc = parseAvalancheAccount(account)?.xpAccount || client.xpAccount;

  // TODO: if no account provided or xpAccount is not provided, fetch from wallet the default account
  if (!xpAcc) {
    throw new Error("Account is not an XP account");
  }

  return publicKeyToXPAddress(xpAcc.publicKey, hrp);
}

export function evmAddressToBytes(address: string) {
  let evmAddress = address;
  if (!evmAddress.startsWith("0x")) {
    evmAddress = `0x${evmAddress}`;
  }
  // EVM addresses are 20 bytes (0x + 40 chars)
  if (evmAddress.length === 42) {
    return utils.hexToBuffer(evmAddress);
  }
  throw new Error(`Invalid EVM address: ${address}`);
}

export function bech32AddressToBytes(address: string) {
  // Check if it's a Bech32 address (contains a hyphen)
  if (address.includes("-")) {
    return utils.bech32ToBytes(address);
  }

  // If it's a Bech32 address without chain alias, add P- prefix
  return utils.bech32ToBytes(`P-${address}`);
}

export function evmOrBech32AddressToBytes(address: string) {
  try {
    return evmAddressToBytes(address);
  } catch (error) {
    return bech32AddressToBytes(address);
  }
}

export function avaxToNanoAvax(amount: number) {
  return BigInt(amount * 1e9);
}

export function nanoAvaxToAvax(amount: bigint) {
  return Number(amount) / 1e9;
}

export function getChainIdFromAlias(
  alias: typeof P_CHAIN_ALIAS | typeof X_CHAIN_ALIAS | typeof C_CHAIN_ALIAS,
  networkId: number
) {
  if (networkId !== MAINNET_NETWORK_ID && networkId !== TESTNET_NETWORK_ID) {
    throw new Error(`Invalid network ID: ${networkId}`);
  }

  switch (alias) {
    case X_CHAIN_ALIAS:
      return networkId === MAINNET_NETWORK_ID
        ? X_CHAIN_MAINNET_ID
        : X_CHAIN_FUJI_ID;
    case C_CHAIN_ALIAS:
      return networkId === MAINNET_NETWORK_ID
        ? C_CHAIN_MAINNET_ID
        : C_CHAIN_FUJI_ID;
    case P_CHAIN_ALIAS:
      return networkId === MAINNET_NETWORK_ID
        ? P_CHAIN_MAINNET_ID
        : P_CHAIN_FUJI_ID;
    default:
      throw new Error(`Invalid chain alias: ${alias}`);
  }
}

// TODO: try to paralleize API calls within this function
export async function fetchCommonTxParams(
  client: AvalancheWalletCoreClient,
  txParams: CommonTxParams,
  sourceChain?: string,
  chainAlias?:
    | typeof P_CHAIN_ALIAS
    | typeof X_CHAIN_ALIAS
    | typeof C_CHAIN_ALIAS,
  subnetId?: string,
  l1ValidationId?: string,
  account?: AvalancheAccount | AddressType | undefined
): Promise<{
  commonTxParams: FormattedCommonTxParams;
  subnetOwners: PChainOwner | undefined;
  disableOwners: PChainOwner | undefined;
}> {
  // If fromAddresses is not provided, use wallet addresses
  const address = getBech32AddressFromAccountOrClient(
    client,
    account,
    chainAlias || P_CHAIN_ALIAS
  );
  const fromAddresses = txParams.fromAddresses || [address];

  const utxos =
    txParams.utxos ||
    (
      await Promise.all(
        fromAddresses.map((address) =>
          getUtxosForAddress(client, {
            address,
            chainAlias: chainAlias || P_CHAIN_ALIAS,
            ...(sourceChain ? { sourceChain } : {}),
          })
        )
      )
    ).flat();

  // Fetch fee state from api
  const feeState = await getFeeState(client.pChainClient);

  let subnetOwners: PChainOwner | undefined;
  if (subnetId) {
    const subnetTx = await getTx(client.pChainClient, {
      txID: subnetId,
      encoding: "hex",
    });
    const strippedTxBytes = utils.strip0x(subnetTx.tx as string);
    const manager = utils.getManagerForVM(sourceChain === "X" ? "AVM" : "PVM");
    const txn = manager.unpack(
      utils.hexToBuffer(strippedTxBytes),
      avaxSerial.SignedTx
    );

    if (pvmSerial.isCreateSubnetTx(txn.unsignedTx)) {
      subnetOwners = new PChainOwner(
        new Int(txn.unsignedTx.getSubnetOwners().threshold.value()),
        txn.unsignedTx.getSubnetOwners().addrs
      );
    }
  }

  let disableOwners: PChainOwner | undefined;
  if (l1ValidationId) {
    const disableTx = await getL1Validator(client.pChainClient, {
      validationID: l1ValidationId,
    });
    disableOwners = new PChainOwner(
      new Int(Number(disableTx.deactivationOwner.threshold)),
      disableTx.deactivationOwner.addresses.map(
        (addr) => new Address(utils.hexToBuffer(addr))
      )
    );
  }

  const result: FormattedCommonTxParams = {
    feeState,
    fromAddressesBytes: fromAddresses.map(bech32AddressToBytes),
    utxos: utxos,
    memo: txParams.memo
      ? new Uint8Array(Buffer.from(txParams.memo))
      : new Uint8Array(),
  };

  if (txParams.changeAddresses) {
    result.changeAddressesBytes =
      txParams.changeAddresses.map(bech32AddressToBytes);
  }
  if (txParams.minIssuanceTime) {
    result.minIssuanceTime = txParams.minIssuanceTime;
  }

  return { commonTxParams: result, subnetOwners, disableOwners };
}

export function formatOutput(output: Output, context: ContextType.Context) {
  return TransferableOutput.fromNative(
    output.assetId ?? context.avaxAssetID,
    BigInt(output.amount * 1e9),
    output.addresses.map(utils.bech32ToBytes),
    BigInt(output.locktime ?? 0),
    output.threshold ?? 1
  );
}

export type PChainOwnerJSON = {
  /**
   * Addresses who can sign the transaction.
   */
  addresses: string[];
  /**
   * Optional. Number of signatures required to sign the transaction.
   * @default 1
   */
  threshold?: number;
};
