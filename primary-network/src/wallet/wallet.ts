import { pvm, utils, type Utxo } from "@avalabs/avalanchejs";

// TEMPORARY INTERFACE FOR WALLET CLIENT
export class Wallet {
    addresses: string[];
    pvmRpc: pvm.PVMApi;
    constructor(params: {nodeUrl: string, addresses: string[]}) {
        this.addresses = params.addresses;
        this.pvmRpc = new pvm.PVMApi(params.nodeUrl);
    }

    getPrivateKeys(): string[] {
        return []
    }

    getPrivateKeysBuffer(): Uint8Array[] {
        return this.getPrivateKeys().map(key => utils.hexToBuffer(key))
    }

    async getUtxos(): Promise<Utxo[]> {
        const utxos = await this.pvmRpc.getUTXOs({ addresses: this.addresses });
        return utxos.utxos;
    }
}