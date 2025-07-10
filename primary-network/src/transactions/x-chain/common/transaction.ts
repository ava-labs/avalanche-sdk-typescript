import { Transaction as CommonTransaction } from "../../common/transaction";
import { toTransferableOutput } from "../../common/utils";
import type { avmSerial } from "@avalabs/avalanchejs";

export class Transaction extends CommonTransaction {
    getOutputs() {
        const transferableOutputs = (this.tx as avmSerial.BaseTx).baseTx.outputs
        return transferableOutputs.map(toTransferableOutput)
    }
}