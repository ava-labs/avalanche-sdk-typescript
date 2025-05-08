import {
    type pvm,
    type Context as ContextType,
    TransferableOutput,
    utils,
    type Utxo,
    type Common,
    Credential,
    UnsignedTx
} from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import type { CommonTxParams, FormattedCommonTxParams, NewTxParams, Output } from "./types";
import {
    C_CHAIN_ALIAS, C_CHAIN_FUJI_ID, P_CHAIN_ALIAS, X_CHAIN_ALIAS, X_CHAIN_FUJI_ID,
    MAINNET_NETWORK_ID,
    TESTNET_NETWORK_ID,
    X_CHAIN_MAINNET_ID,
    C_CHAIN_MAINNET_ID,
    P_CHAIN_MAINNET_ID,
    P_CHAIN_FUJI_ID
} from "./consts";
import type { Transaction } from "./transaction";
const errWalletNotFound = (param: string) => `Wallet not found. Link a wallet or provide required parameter: ${param}`

export function formatOutput(output: Output, context: ContextType.Context) {
    return TransferableOutput.fromNative(     
        output.assetId ?? context.avaxAssetID,
        BigInt(output.amount * 1e9),
        output.addresses.map(utils.bech32ToBytes),
        BigInt(output.locktime ?? 0),
        output.threshold ?? 1,
    )
}

export async function fetchCommonTxParams(
    txParams: CommonTxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    wallet?: Wallet,
    sourceChain?: string,
): Promise<FormattedCommonTxParams> {
    // If fromAddresses is not provided, use wallet addresses
    if (!txParams.fromAddresses) {
        if (wallet) {
            txParams.fromAddresses = wallet.addresses;
        } else {
            throw new Error(errWalletNotFound('fromAddresses'));
        }
    }

    // If utxos are not provided, use wallet to fetch utxos
    if (!txParams.utxos) {
        if (wallet) {
            txParams.utxos = await wallet.getUtxos(txParams.fromAddresses, sourceChain)
        } else {
            throw new Error(errWalletNotFound('utxos'));
        }
    }

    // Fetch fee state from api
    const feeState = await pvmRpc.getFeeState()

    // Format outputs as per AvalancheJS
    const formattedOutputs = txParams.outputs ? txParams.outputs.map(output => formatOutput(output, context)) : []

    return {
        feeState,
        fromAddressesBytes: txParams.fromAddresses.map(utils.bech32ToBytes),
        utxos: txParams.utxos,
        outputs: formattedOutputs,
        memo: txParams.memo ? new Uint8Array(Buffer.from(txParams.memo)) : new Uint8Array(),
    }
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

/**
 * Inputs must be sorted and unique. Inputs are sorted first lexicographically by their TxID and then by the UTXOIndex from low to high.
 * If there are inputs that have the same TxID and UTXOIndex, then the transaction is invalid as this would result in a double spend.
 */
export function sortUtxos(utxos: Utxo[]): Utxo[] {
    return [...utxos].sort((a, b) => {
        // First compare by txID
        const txIdCompare = a.utxoId.txID.toString().localeCompare(b.utxoId.txID.toString());
        if (txIdCompare !== 0) {
            return txIdCompare;
        }
        // If txIDs are equal, compare by outputIndex
        return a.utxoId.outputIdx.value() - b.utxoId.outputIdx.value();
    });
}

export function getTxFromBytes(txBytes: string): [Common.Transaction, Credential[]] {
    const strippedTxBytes = utils.strip0x(txBytes)
    const manager = utils.getManagerForVM('PVM')
    
    const parsedTx = manager.unpackTransaction(Buffer.from(strippedTxBytes, 'hex'));
    const txBytesWithoutCreds = utils.bufferToHex(parsedTx.toBytes(manager.getDefaultCodec()))

    // get first 6 bytes (codec + type)
    const codecAndType = strippedTxBytes.slice(0, 12)

    // replace txBytesWithoutCreds from txBytes to get credentials
    const creds = strippedTxBytes.replace(codecAndType + utils.strip0x(txBytesWithoutCreds), '')

    // remove type from the creds (frist 4 bytes)
    const credsWithoutType = Buffer.from(utils.strip0x(creds).slice(8), 'hex');

    const credentials: Credential[] = []
    let remainingBytes = new Uint8Array(credsWithoutType)

    // signature length is 65 bytes
    while (remainingBytes.length >= 65) {
        const [cred, rest] = Credential.fromBytes(remainingBytes.slice(4), manager.getDefaultCodec());
        credentials.push(cred)
        remainingBytes = rest
    }
    return [parsedTx, credentials];
}

export function getTxClassFromBytes<T extends Transaction>(
    Tx: new (params: NewTxParams) => T,
    txBytes: string,
    pvmRpc: pvm.PVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): T {
    const [tx, credentials] = getTxFromBytes(txBytes)
    const unsignedTx = new UnsignedTx(
        tx,
        // dummy values for utxos and addressMaps, since these can't be generated from bytes
        [],
        new utils.AddressMaps(),
        credentials,
    )
    return new Tx({ unsignedTx, pvmRpc, nodeUrl, wallet })
}
