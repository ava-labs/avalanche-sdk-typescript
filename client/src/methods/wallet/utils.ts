import {
  Address,
  avaxSerial,
  Common,
  Context as ContextType,
  Int,
  PChainOwner,
  pvmSerial,
  secp256k1,
  TransferableOutput,
  TransferOutput,
  TypeSymbols,
  UnsignedTx,
  utils,
} from "@avalabs/avalanchejs";
import { Account, Address as AddressType } from "viem";
import { getAddresses } from "viem/actions";
import {
  AvalancheAccount,
  parseAvalancheAccount,
  publicKeyToXPAddress,
} from "../../accounts/index.js";
import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { getUtxosForAddress } from "../../utils/index.js";
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
import { getAccountPubKey } from "./getAccountPubKey.js";
import {
  CommonTxParams,
  FormattedCommonAVMTxParams,
  FormattedCommonPVMTxParams,
  Output,
  TransferableOutputFull,
} from "./types/common.js";
export function getBaseUrl(client: AvalancheWalletCoreClient): string {
  const { chain } = client;
  const configUrl = chain?.rpcUrls?.default?.http?.[0];

  if (!configUrl) {
    throw new Error("RPC URL not found");
  }

  return new URL(configUrl).origin;
}

export async function getBech32AddressFromAccountOrClient(
  client: AvalancheWalletCoreClient,
  account: AvalancheAccount | AddressType | undefined,
  chainAlias:
    | typeof P_CHAIN_ALIAS
    | typeof X_CHAIN_ALIAS
    | typeof C_CHAIN_ALIAS,
  hrp: string
): Promise<string> {
  const xpAcc = parseAvalancheAccount(account)?.xpAccount || client.xpAccount;
  const evmAcc = parseAvalancheAccount(account)?.evmAccount || client.account;

  if (!xpAcc || !evmAcc) {
    const { xp, evm } = await getAccountPubKey(client);
    return `${chainAlias}-${publicKeyToXPAddress(
      chainAlias === C_CHAIN_ALIAS ? evm : xp,
      hrp
    )}`;
  }

  if (chainAlias === C_CHAIN_ALIAS && !evmAcc.publicKey) {
    throw new Error("EVM public key not found for evm account");
  }

  return `${chainAlias}-${publicKeyToXPAddress(
    chainAlias === C_CHAIN_ALIAS ? evmAcc.publicKey! : xpAcc.publicKey,
    hrp
  )}`;
}

export async function getEVMAddressFromAccountOrClient(
  client: AvalancheWalletCoreClient,
  account: AvalancheAccount | undefined
): Promise<string> {
  let currentAccountEVMAddress =
    account?.getEVMAddress() || (client.account as never as Account)?.address;

  if (!currentAccountEVMAddress) {
    const getAddressesResponse = await getAddresses(client);
    if (getAddressesResponse.length === 0) {
      throw new Error("No EVM address found from wallet");
    }
    if (getAddressesResponse.length > 1) {
      throw new Error(
        "Multiple EVM addresses found from wallet, pass the from address"
      );
    }
    currentAccountEVMAddress = getAddressesResponse[0] as `0x${string}`;
  }
  return currentAccountEVMAddress;
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

/**
 * Convert AVAX to wei
 * @param amount - The amount of AVAX to convert
 * @returns The amount in wei
 */
export function avaxToWei(amount: number) {
  return BigInt(amount * 1e18);
}

/**
 * Convert wei to AVAX
 * @param amount - The amount of wei to convert
 * @returns The amount in AVAX
 */
export function weiToAvax(amount: bigint) {
  return amount / BigInt(1e18);
}

/**
 * Convert AVAX to nanoAVAX
 * @param amount - The amount of AVAX to convert
 * @returns The amount in nanoAVAX
 */
export function avaxToNanoAvax(amount: number) {
  return BigInt(amount * 1e9);
}

/**
 * Convert wei to nanoAVAX
 * @param amount - The amount of wei to convert
 * @returns The amount in nanoAVAX
 */
export function weiToNanoAvax(amount: bigint) {
  return amount / BigInt(1e9);
}

/**
 * Convert nanoAVAX to wei
 * @param amount - The amount of nanoAVAX to convert
 * @returns The amount in wei
 */
export function nanoAvaxToWei(amount: bigint) {
  return amount * BigInt(1e9);
}

/**
 * Convert nanoAVAX to AVAX
 * @param amount - The amount of nanoAVAX to convert
 * @returns The amount in AVAX
 */
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
export async function fetchCommonPVMTxParams(
  client: AvalancheWalletCoreClient,
  params: {
    txParams: CommonTxParams;
    sourceChain?: string;
    chainAlias?:
      | typeof P_CHAIN_ALIAS
      | typeof X_CHAIN_ALIAS
      | typeof C_CHAIN_ALIAS;
    subnetId?: string;
    l1ValidationId?: string;
    account?: AvalancheAccount | AddressType | undefined;
    context: ContextType.Context;
  }
): Promise<{
  commonTxParams: FormattedCommonPVMTxParams;
  subnetOwners: PChainOwner | undefined;
  disableOwners: PChainOwner | undefined;
}> {
  const {
    txParams,
    sourceChain,
    chainAlias,
    subnetId,
    l1ValidationId,
    account,
    context,
  } = params;
  // If fromAddresses is not provided, use wallet addresses
  const address = await getBech32AddressFromAccountOrClient(
    client,
    account,
    chainAlias || P_CHAIN_ALIAS,
    context.hrp
  );

  const fromAddressesSet = new Set(txParams.fromAddresses || [address]);

  let subnetOwners: PChainOwner | undefined;
  if (subnetId) {
    const subnetTx = await getTx(client.pChainClient, {
      txID: subnetId,
      encoding: "hex",
    });
    const strippedTxBytes = utils.strip0x(subnetTx.tx as string);
    const manager = utils.getManagerForVM(
      chainAlias === "X" ? "AVM" : chainAlias === "C" ? "EVM" : "PVM"
    );
    const txn = manager.unpack(
      utils.hexToBuffer(strippedTxBytes),
      avaxSerial.SignedTx
    );

    if (pvmSerial.isCreateSubnetTx(txn.unsignedTx)) {
      subnetOwners = new PChainOwner(
        new Int(txn.unsignedTx.getSubnetOwners().threshold.value()),
        txn.unsignedTx.getSubnetOwners().addrs
      );
      txn.unsignedTx.getSubnetOwners().addrs.forEach((addr) => {
        fromAddressesSet.add(`${P_CHAIN_ALIAS}-${addr.toString(context.hrp)}`);
      });
    }
  }

  let disableOwners: PChainOwner | undefined;
  if (l1ValidationId) {
    const disableTx = await getL1Validator(client.pChainClient, {
      validationID: l1ValidationId,
    });
    disableOwners = new PChainOwner(
      new Int(Number(disableTx.deactivationOwner.threshold)),
      disableTx.deactivationOwner.addresses.map(Address.fromString)
    );
    disableTx.deactivationOwner.addresses.forEach((addr) => {
      const address = addr.startsWith("P-") ? addr : `${P_CHAIN_ALIAS}-${addr}`;
      fromAddressesSet.add(address);
    });
  }

  const fromAddresses = Array.from(fromAddressesSet);

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

  const result: FormattedCommonPVMTxParams = {
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

// TODO: try to paralleize API calls within this function
export async function fetchCommonAVMTxParams(
  client: AvalancheWalletCoreClient,
  params: {
    txParams: CommonTxParams;
    sourceChain?: string;
    chainAlias?:
      | typeof P_CHAIN_ALIAS
      | typeof X_CHAIN_ALIAS
      | typeof C_CHAIN_ALIAS;
    account?: AvalancheAccount | AddressType | undefined;
    context: ContextType.Context;
  }
): Promise<{
  commonTxParams: FormattedCommonAVMTxParams;
}> {
  const { txParams, sourceChain, chainAlias, account, context } = params;

  // If fromAddresses is not provided, use wallet addresses
  const address = await getBech32AddressFromAccountOrClient(
    client,
    account,
    chainAlias || X_CHAIN_ALIAS,
    context.hrp
  );

  const fromAddressesSet = new Set(txParams.fromAddresses || [address]);
  const fromAddresses = Array.from(fromAddressesSet);

  const utxos =
    txParams.utxos ||
    (
      await Promise.all(
        fromAddresses.map((address) =>
          getUtxosForAddress(client, {
            address,
            chainAlias: chainAlias || X_CHAIN_ALIAS,
            ...(sourceChain ? { sourceChain } : {}),
          })
        )
      )
    ).flat();

  const result: FormattedCommonAVMTxParams = {
    txFee: {
      txFee: context.baseTxFee,
      createAssetTxFee: context.createAssetTxFee,
    },
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

  return { commonTxParams: result };
}

export function formatOutput(output: Output, context: ContextType.Context) {
  return TransferableOutput.fromNative(
    output.assetId ?? context.avaxAssetID,
    output.amount,
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

export function isTxImportExport(tx: Common.Transaction) {
  return (
    tx._type === TypeSymbols.AvmExportTx ||
    tx._type === TypeSymbols.AvmImportTx ||
    tx._type === TypeSymbols.EvmExportTx ||
    tx._type === TypeSymbols.EvmImportTx ||
    tx._type === TypeSymbols.PvmImportTx ||
    tx._type === TypeSymbols.PvmExportTx
  );
}

export async function addPChainOwnerAuthSignature(
  unsignedTx: UnsignedTx,
  owners: PChainOwner,
  authIndices: number[],
  signature: Uint8Array<ArrayBufferLike>,
  publicKey: string
) {
  // Get the addresses that need to sign based on subnetAuth indices
  const signingOwners = owners.addresses.filter((_, index) =>
    authIndices.includes(index)
  );

  // Last credential index is for the subnet auth signatures
  const credentialIndex = unsignedTx.getCredentials().length - 1;
  const address = new Address(
    secp256k1.publicKeyBytesToAddress(utils.hexToBuffer(publicKey))
  );

  const signerIndex = signingOwners.findIndex(
    (owner) => owner.value() === address.value()
  );

  if (signerIndex !== -1) {
    unsignedTx.addSignatureAt(signature, credentialIndex, signerIndex);
  }
}

// AvalancheJS exports output as Amounter instead of TransferOutput,
// so we cast them here.
export function toTransferableOutput(
  output: TransferableOutput
): TransferableOutputFull {
  return {
    ...output,
    // Amounter to TransferOutput
    output: output.output as unknown as TransferOutput,
  };
}

function addOrModifyXPAddressAliasUtil(
  address: string | undefined,
  alias: string
) {
  if (!address) {
    return undefined;
  }
  if (address.startsWith(alias)) {
    return address;
  }

  const strippedAddress =
    address.split("-").length === 1 ? address : address.split("-")[1];

  return `${alias}-${strippedAddress}`;
}

export function addOrModifyXPAddressesAlias(
  address: string[] | undefined,
  alias: string
) {
  if (!address) {
    return undefined;
  }
  return address
    .map((addr) => addOrModifyXPAddressAliasUtil(addr, alias))
    .filter((addr) => addr !== undefined);
}
