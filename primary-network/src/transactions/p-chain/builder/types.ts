import type { pvm } from "@avalabs/avalanchejs"
import type { Context as ContextType }  from '@avalabs/avalanchejs';
import type { Wallet } from "../../../wallet";

export type NewTxBuilderParams = {
    nodeUrl: string,
    wallet: Wallet | undefined,
    pvmRpc: pvm.PVMApi,
}

export type TxBuilderConstructorParams = {
    nodeUrl: string,
    wallet: Wallet | undefined,
    pvmRpc: pvm.PVMApi,
    context: ContextType.Context,
}
