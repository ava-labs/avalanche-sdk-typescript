import {
    type pvm,
    type Context as ContextType,
    TransferableOutput,
    utils,
    type Utxo,
    type Common,
    Credential,
    UnsignedTx,
    secp256k1,
    type TransferOutput,
    pvmSerial,
    Address,
} from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import type { CommonTxParams, FormattedCommonTxParams, NewTxParams, Output, SubnetOwners } from "./types";
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

// TODO: try to paralleize API calls within this function
export async function fetchCommonTxParams(
    txParams: CommonTxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    wallet?: Wallet,
    sourceChain?: string,
    subnetId?: string,
): Promise<{
    commonTxParams: FormattedCommonTxParams,
    subnetOwners: SubnetOwners | undefined
}> {
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

    let subnetOwners: SubnetOwners | undefined
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

    return { commonTxParams: result, subnetOwners }
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

export async function addSigToAllCreds(
    unsignedTx: UnsignedTx,
    privateKeys: Uint8Array[],
) {
    const unsignedBytes = unsignedTx.toBytes();

    await Promise.all(
        privateKeys.map(async (privateKey) => {
            const publicKey = secp256k1.getPublicKey(privateKey);

            if (unsignedTx.hasPubkey(publicKey)) {
                const signature = await secp256k1.sign(unsignedBytes, privateKey);
                for (let i = 0; i < unsignedTx.getCredentials().length; i++) {
                    unsignedTx.addSignatureAt(signature, i, 0);
                }
            }
        }),
    );
};

export async function addSubnetAuthSignature(
    subnetOwners: SubnetOwners,
    subnetAuth: number[],
    unsignedTx: UnsignedTx,
    privateKeys: Uint8Array[],
) {
    // Get the addresses that need to sign based on subnetAuth indices
    const signingOwners = subnetOwners.addresses.filter((_, index) => subnetAuth.includes(index));

    // Last credential index is for the subnet auth signatures
    const credentialIndex = unsignedTx.getCredentials().length - 1;

    // Extract HRP from first signing owner address
    const hrp = signingOwners[0]?.split('1')[0];
    if (!hrp) {
        throw new Error('No signing owners found');
    }

    // Sign with available private keys if they match required signers
    await Promise.all(privateKeys.map(async (privateKey) => {
        const address = new Address(
            secp256k1.publicKeyBytesToAddress(
                secp256k1.getPublicKey(privateKey)
            )
        );
        const addressString = address.toString(hrp);

        const signerIndex = signingOwners.indexOf(addressString);
        if (signerIndex !== -1) {
            const signature = await secp256k1.sign(unsignedTx.toBytes(), privateKey);
            unsignedTx.addSignatureAt(signature, credentialIndex, signerIndex);
        }
    }));
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
export function toTransferableOutput(output: TransferableOutput) {
    return {
        ...output,
        output: output.output as unknown as TransferOutput
    }
}
