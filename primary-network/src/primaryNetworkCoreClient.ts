import { Context as ContextType, pvm, evm }  from '@avalabs/avalanchejs';
import { Wallet } from "./wallet";
import { getNodeUrlFromChain } from './utils';

export type PrimaryNetworkClientParams = {
    nodeUrlOrChain: 'mainnet' | 'fuji' | `http${'s' | ''}://${string}`,
    privateKeys?: string[] | undefined,
};

export class PrimaryNetworkCore {
    nodeUrl: string;
    wallet: Wallet;
    context: ContextType.Context | undefined;
    pvmRpc: pvm.PVMApi;
    evmRpc: evm.EVMApi;

    constructor(params: PrimaryNetworkClientParams) {
        this.nodeUrl = getNodeUrlFromChain(params.nodeUrlOrChain)
        this.pvmRpc = new pvm.PVMApi(this.nodeUrl)
        this.evmRpc = new evm.EVMApi(this.nodeUrl)
        this.wallet = new Wallet({
            nodeUrl: this.nodeUrl,
            privateKeys: params.privateKeys,
        });
    }

    /**
     * Initializes the context when required if it is not already initialized.
     * @returns The context.
    */
    async initializeContextIfNot() {
        if (!this.context) {
            this.context = await ContextType.getContextFromURI(this.nodeUrl);
        }
        return this.context;
    }

    linkPrivateKeys(privateKeys: string[]) {
        this.wallet.addPrivateKeys(privateKeys);
    }
}

export function createPrimaryNetworkCoreClient(params: PrimaryNetworkClientParams) {
    return new PrimaryNetworkCore(params)
}
