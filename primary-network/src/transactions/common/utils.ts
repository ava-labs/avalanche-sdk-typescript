import {
    type pvm,
    type Context as ContextType,
    TransferableOutput,
    utils,
    UnsignedTx,
    type TransferOutput,
    pvmSerial,
    type Common,
    type Credential,
    evm,
} from "@avalabs/avalanchejs";
import type { Wallet } from "../../wallet";
import type { CommonTxParams, FormattedCommonTxParams, NewTxParams, Output, PChainOwner, TransferableOutputFull } from "./types";

import {
    C_CHAIN_ALIAS, C_CHAIN_FUJI_ID, P_CHAIN_ALIAS, X_CHAIN_ALIAS, X_CHAIN_FUJI_ID,
    MAINNET_NETWORK_ID,
    TESTNET_NETWORK_ID,
    X_CHAIN_MAINNET_ID,
    C_CHAIN_MAINNET_ID,
    P_CHAIN_MAINNET_ID,
    P_CHAIN_FUJI_ID,
} from "./consts";
import type { Transaction } from "./transaction";
import { getTxFromBytes } from "@avalanche-sdk/rpc/utils";

export const errWalletNotFound = (param: string) => {
    return new Error(`Wallet not found. Link a wallet or provide required parameter: ${param}`)
}

export function formatOutput(output: Output, context: ContextType.Context) {
    return TransferableOutput.fromNative(     
        output.assetId ?? context.avaxAssetID,
        BigInt(output.amount * 1e9),
        output.addresses.map(utils.bech32ToBytes),
        BigInt(output.locktime ?? 0),
        output.threshold ?? 1,
    )
}

// TODO: try to paralleize API calls within this function
export async function fetchCommonTxParams(
    txParams: CommonTxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    wallet?: Wallet,
    sourceChain?: string,
    subnetId?: string,
    l1ValidationId?: string,
): Promise<{
    commonTxParams: FormattedCommonTxParams,
    subnetOwners: PChainOwner | undefined,
    disableOwners: PChainOwner | undefined,
}> {
    // If fromAddresses is not provided, use wallet addresses
    if (!txParams.fromAddresses) {
        if (wallet) {
            txParams.fromAddresses = wallet.getBech32Addresses(P_CHAIN_ALIAS, context.networkID);
        } else {
            throw errWalletNotFound('fromAddresses');
        }
    }

    // If utxos are not provided, use wallet to fetch utxos
    if (!txParams.utxos) {
        if (wallet) {
            txParams.utxos = await wallet.getUtxos(txParams.fromAddresses, sourceChain)
        } else {
            throw errWalletNotFound('utxos');
        }
    }

    // Fetch fee state from api
    const feeState = await pvmRpc.getFeeState()

    let subnetOwners: PChainOwner | undefined
    if (subnetId) {
        const subnetTx = await pvmRpc.getTx({
            txID: subnetId,
        })
        if (pvmSerial.isCreateSubnetTx(subnetTx.unsignedTx)) {
            subnetOwners = {
                addresses: subnetTx.unsignedTx.getSubnetOwners().addrs.map(addr => addr.toString(context.hrp)),
                threshold: subnetTx.unsignedTx.getSubnetOwners().threshold.value()
            }
        }
    }

    let disableOwners: PChainOwner | undefined
    if (l1ValidationId) {
        const disableTx = await pvmRpc.getL1Validator(l1ValidationId)
        disableOwners = {
            addresses: disableTx.deactivationOwner.addresses.map(addr => addr.toString(context.hrp)),
            threshold: disableTx.deactivationOwner.threshold.value()
        }
    }

    const result: FormattedCommonTxParams = {
        feeState,
        fromAddressesBytes: txParams.fromAddresses.map(bech32AddressToBytes),
        utxos: txParams.utxos,
        memo: txParams.memo ? new Uint8Array(Buffer.from(txParams.memo)) : new Uint8Array(),
    }

    if (txParams.changeAddresses) {
        result.changeAddressesBytes = txParams.changeAddresses.map(bech32AddressToBytes)
    }
    if (txParams.minIssuanceTime) {
        result.minIssuanceTime = txParams.minIssuanceTime
    }

    return { commonTxParams: result, subnetOwners, disableOwners }
}

export function getChainIdFromAlias(
    alias: typeof P_CHAIN_ALIAS | typeof X_CHAIN_ALIAS | typeof C_CHAIN_ALIAS,
    networkId: number,
) {
    if (networkId !== MAINNET_NETWORK_ID && networkId !== TESTNET_NETWORK_ID) {
        throw new Error(`Invalid network ID: ${networkId}`);
    }

    switch (alias) {
        case X_CHAIN_ALIAS:
            return networkId === MAINNET_NETWORK_ID ? X_CHAIN_MAINNET_ID : X_CHAIN_FUJI_ID;
        case C_CHAIN_ALIAS:
            return networkId === MAINNET_NETWORK_ID ? C_CHAIN_MAINNET_ID : C_CHAIN_FUJI_ID;
        case P_CHAIN_ALIAS:
            return networkId === MAINNET_NETWORK_ID ? P_CHAIN_MAINNET_ID : P_CHAIN_FUJI_ID;
        default:
            throw new Error(`Invalid chain alias: ${alias}`);
    }
}

export function getTxClassFromBytes<T extends Transaction>(
    Tx: new (params: NewTxParams) => T,
    txBytes: string,
    rpc: pvm.PVMApi | evm.EVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): T {
    let alias = P_CHAIN_ALIAS;
    if (rpc instanceof evm.EVMApi) {
        alias = C_CHAIN_ALIAS;
    }
    const [tx, credentials] = getTxFromBytes(txBytes, alias)
    const unsignedTx = new UnsignedTx(
        tx as unknown as Common.Transaction,
        // dummy values for utxos and addressMaps, since these can't be generated from bytes
        [],
        new utils.AddressMaps(),
        credentials as unknown as Credential[],
    )
    return new Tx({ unsignedTx, rpc, nodeUrl, wallet })
}

export function evmAddressToBytes(address: string) {
    let evmAddress = address;
    if (!evmAddress.startsWith('0x')) {
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
    if (address.includes('-')) {
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

// AvalancheJS exports output as Amounter instead of TransferOutput,
// so we cast them here.
export function toTransferableOutput(output: TransferableOutput): TransferableOutputFull {
    return {
        ...output,
        // Amounter to TransferOutput
        output: output.output as unknown as TransferOutput
    }
}

export function avaxToNanoAvax(amount: number) {
    return BigInt(amount * 1e9)
}

export function nanoAvaxToAvax(amount: bigint) {
    return Number(amount) / 1e9
}
