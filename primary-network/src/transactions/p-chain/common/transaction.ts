import { Transaction as CommonTransaction } from "../../common/transaction";
import { toTransferableOutput } from "../../common/utils";
import type { pvmSerial } from "@avalabs/avalanchejs";

export class Transaction extends CommonTransaction {
    getOutputs() {
        const transferableOutputs = (this.tx as pvmSerial.BaseTx).baseTx.outputs
        return transferableOutputs.map(toTransferableOutput)
    }
}
