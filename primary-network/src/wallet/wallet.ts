import { pvm, evm, secp256k1, utils, type Utxo } from "@avalabs/avalanchejs";
import { bech32 } from "@scure/base";
import { C_CHAIN_ALIAS, P_CHAIN_ALIAS, type X_CHAIN_ALIAS } from "../transactions/common/consts";

// TEMPORARY INTERFACE FOR WALLET CLIENT
export class Wallet {
    privateKeys: string[];
    pvmRpc: pvm.PVMApi;
    evmRpc: evm.EVMApi;

    constructor(params: {
        nodeUrl: string,
        privateKeys: string[],
    }) {
        this.privateKeys = params.privateKeys;
        this.pvmRpc = new pvm.PVMApi(params.nodeUrl);
        this.evmRpc = new evm.EVMApi(params.nodeUrl);
    }

    getBech32Addresses(
        chainAlias: typeof P_CHAIN_ALIAS | typeof X_CHAIN_ALIAS | typeof C_CHAIN_ALIAS,
        networkId = 1,
    ): string[] {
        return this.privateKeys.map(pk => addressBytesToBech32String(
            networkId === 1 ? 'avax' : 'fuji',
            chainAlias,
            Buffer.from(privateKeyToAddressBytes(pk)),
        ));
    }

    getEvmAddresses() {
        return this.privateKeys.map(pk => addressBytesToEvmAddress(Buffer.from(privateKeyToAddressBytes(pk))));
    }

    getAddressBytes(): Uint8Array[] {
        return this.privateKeys.map(address => privateKeyToAddressBytes(address))
    }

    getPrivateKeys(): string[] {
        return this.privateKeys;
    }

    getPrivateKeysBuffer(): Uint8Array[] {
        return this.getPrivateKeys().map(key => utils.hexToBuffer(key))
    }

    async getUtxos(
        addresses?: string[],
        sourceChain?: string,
        chainAlias: typeof P_CHAIN_ALIAS | typeof X_CHAIN_ALIAS | typeof C_CHAIN_ALIAS = P_CHAIN_ALIAS,
    ): Promise<Utxo[]> {
        let rpc: pvm.PVMApi | evm.EVMApi = this.pvmRpc;
        if (chainAlias === C_CHAIN_ALIAS) {
            rpc = this.evmRpc;
        }
        const utxos = await rpc.getUTXOs({
            addresses: addresses ?? this.getBech32Addresses(chainAlias),
            ...(sourceChain ? { sourceChain } : {}),
        });
        return utxos.utxos;
    }
}

function privateKeyToAddressBytes(privateKey: string): Uint8Array {
    const publicKey = secp256k1.getPublicKey(utils.hexToBuffer(privateKey));
    return secp256k1.publicKeyBytesToAddress(publicKey);
}

function addressBytesToBech32String(
    hrp: string,
    chainAlias: 'P' | 'X' | 'C',
    bytes: Buffer,
): string {
    return `${chainAlias}-${bech32.encode(
        hrp,
        bech32.toWords(bytes),
    )}`;
}

function addressBytesToEvmAddress(bytes: Buffer): string {
    return utils.bufferToHex(bytes);
}