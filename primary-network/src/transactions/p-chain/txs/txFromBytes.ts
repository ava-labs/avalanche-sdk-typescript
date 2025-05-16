import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";
import type { NewTxParams } from "../common/types";
import { Transaction } from "../common/transaction";
import { getTxClassFromBytes } from "../common/utils";

export type NewTxFromBytesParams<T extends Transaction> = {
    hexTxBytes: string,
    txClass?: new (params: NewTxParams) => T,
}

export function newTxFromBytes<T extends Transaction>(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    params: NewTxFromBytesParams<T>,
): T {
    return getTxClassFromBytes(
        params.txClass ?? (Transaction as new (params: NewTxParams) => T),
        params.hexTxBytes,
        primaryNetworkCoreClient.pvmRpc,
        primaryNetworkCoreClient.nodeUrl,
        primaryNetworkCoreClient.wallet,
    )
}
