import { pvm, secp256k1, utils, type Utxo } from "@avalabs/avalanchejs";
import { bech32 } from "@scure/base";

// TEMPORARY INTERFACE FOR WALLET CLIENT
export class Wallet {
    addresses: string[];
    privateKeys: string[];
    pvmRpc: pvm.PVMApi;
    constructor(params: {nodeUrl: string, privateKeys: string[]}) {
        this.privateKeys = params.privateKeys;
        this.addresses = this.privateKeys.map(key => privateKeyToAddress(key));
        this.pvmRpc = new pvm.PVMApi(params.nodeUrl);
    }

    getPrivateKeys(): string[] {
        return this.privateKeys;
    }

    getPrivateKeysBuffer(): Uint8Array[] {
        return this.getPrivateKeys().map(key => utils.hexToBuffer(key))
    }

    getFromAddressBytes(): Uint8Array[] {
        return this.privateKeys.map(address => privateKeyToAddressBytes(address))
    }

    async getUtxos(addresses?: string[], sourceChain?: string): Promise<Utxo[]> {
        const utxos = await this.pvmRpc.getUTXOs({
            addresses: addresses ?? this.addresses,
            ...(sourceChain ? { sourceChain } : {}),
        });
        return utxos.utxos;
    }
}

function privateKeyToAddressBytes(privateKey: string): Uint8Array {
    const publicKey = secp256k1.getPublicKey(utils.hexToBuffer(privateKey));
    return secp256k1.publicKeyBytesToAddress(publicKey);
}

function privateKeyToAddress(privateKey: string): string {
    const publicKey = secp256k1.getPublicKey(utils.hexToBuffer(privateKey));
    const addr = secp256k1.publicKeyBytesToAddress(publicKey);
    return addressToString("fuji", "P", Buffer.from(addr));
}

function addressToString(hrp: string, chainid: string, bytes: Buffer): string {
    return `${chainid}-${bech32.encode(
        hrp,
        bech32.toWords(bytes),
    )}`;
}