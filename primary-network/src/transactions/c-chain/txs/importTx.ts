import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";
import { Transaction } from "../../common";
import type { NewTxParams } from "../../common/types";
import { evm, utils, type evmSerial, type Utxo } from "@avalabs/avalanchejs";
import { bech32AddressToBytes, errWalletNotFound, getChainIdFromAlias } from "../../common/utils";
import { createAvalancheClient } from "@avalanche-sdk/rpc";
import { C_CHAIN_ALIAS, type P_CHAIN_ALIAS, type X_CHAIN_ALIAS } from "../../common/consts";

export type ImportTxParams = {
    /**
     * The chain alias to import the funds from.
     */
    sourceChain: typeof P_CHAIN_ALIAS | typeof X_CHAIN_ALIAS,
    /**
     * The EVM address to import the funds to.
     */
    toAddress: string,
    /**
     * Optional. UTXOs to use as inputs for the transaction. These UTXOs
     * must be in the atomic memory i.e. should already have been exported
     * from the source chain. If not provided, utxos will be fetched from
     * the `fromAddresses`. Preference would be given to `utxos` array.
     */
    utxos?: Utxo[],
    /**
     * Optional. Bech32 addresses to fetch UTXOs and send funds from.
     * If not provided, `utxos` can be used. Preference would be given
     * to `utxos` array.
     */
    fromAddresses?: string[],
}

export class ImportTx extends Transaction {
    override tx: evmSerial.ImportTx
    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as evmSerial.ImportTx
    }
}

export async function newImportTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    params: ImportTxParams,
): Promise<ImportTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    // TODO: use this as the primary RPC in the core client
    const evmRpc = createAvalancheClient({
        transport: {
            type: "http",
            url: `${primaryNetworkCoreClient.nodeUrl}/ext/bc/C/rpc`,
        },
    })
    const baseFee = await evmRpc.baseFee()

    // If fromAddresses is not provided, use wallet addresses
    const wallet = primaryNetworkCoreClient.wallet
    if (!params.fromAddresses) {
        if (wallet) {
            params.fromAddresses = wallet.getBech32Addresses(C_CHAIN_ALIAS, context.networkID);
        } else {
            throw new Error(errWalletNotFound('fromAddresses'));
        }
    }

    // If utxos are not provided, use wallet to fetch utxos
    if (!params.utxos) {
        if (wallet) {
            params.utxos = await wallet.getUtxos(
                params.fromAddresses,
                getChainIdFromAlias(params.sourceChain, context.networkID),
                C_CHAIN_ALIAS,
            )
        } else {
            throw new Error(errWalletNotFound('utxos'));
        }
    }
    const fromAddressesBytes = params.fromAddresses.map(address => bech32AddressToBytes(address));

    const unsignedTx = evm.newImportTxFromBaseFee(
        context,
        utils.hexToBuffer(params.toAddress),
        fromAddressesBytes,
        params.utxos,
        params.sourceChain,
        BigInt(baseFee),
    );

    return new ImportTx({
        unsignedTx,
        wallet: primaryNetworkCoreClient.wallet,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        rpc: primaryNetworkCoreClient.evmRpc,
    })
}
