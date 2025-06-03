import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";
import { Transaction } from "../../common";
import type { NewTxParams } from "../../common/types";
import { evm, utils, type evmSerial } from "@avalabs/avalanchejs";
import { avaxToNanoAvax, bech32AddressToBytes, getChainIdFromAlias } from "../../common/utils";
import { createAvalancheClient } from "@avalanche-sdk/rpc";
import type { P_CHAIN_ALIAS, X_CHAIN_ALIAS } from "../../common/consts";

export type ExportTxParams = {
    /**
     * The chain alias to export the funds to.
     */
    destinationChain: typeof P_CHAIN_ALIAS | typeof X_CHAIN_ALIAS,
    /**
     * The EVM address to export the funds from.
     */
    fromAddress: string,
    /**
     * The conslidated exported output (UTXO)
     */
    exportedOutput: {
        /**
         * Addresses who can sign the consuming of this UTXO.
         */
        addresses: string[],
        /**
         * The amount (in AVAX) held by this exported output.
         */
        amountInAvax: number,
        /**
         * Optional. Timestamp in seconds after which this UTXO can be consumed.
         */
        locktime?: number,
        /**
         * Optional. Threshold of `addresses`' signatures required to consume this UTXO.
         */
        threshold?: number,
    }
}

export class ExportTx extends Transaction {
    override tx: evmSerial.ExportTx
    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as evmSerial.ExportTx
    }
}

export async function newExportTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    params: ExportTxParams,
): Promise<ExportTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    const evmRpc = createAvalancheClient({
        transport: {
            type: "http",
            url: `${primaryNetworkCoreClient.nodeUrl}/ext/bc/C/rpc`,
        },
    })
    const [txCount, baseFee] = await Promise.all([
        evmRpc.getTransactionCount({ address: `0x${utils.strip0x(params.fromAddress)}` }),
        evmRpc.baseFee()
    ]);
    const pAddressBytes = params.exportedOutput.addresses.map(address => bech32AddressToBytes(address));

    const unsignedTx = evm.newExportTxFromBaseFee(
        context,
        BigInt(baseFee),
        avaxToNanoAvax(params.exportedOutput.amountInAvax),
        getChainIdFromAlias(params.destinationChain, context.networkID),
        utils.hexToBuffer(params.fromAddress),
        pAddressBytes,
        BigInt(txCount),
    );

    return new ExportTx({
        unsignedTx,
        wallet: primaryNetworkCoreClient.wallet,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        rpc: primaryNetworkCoreClient.evmRpc,
    })
}