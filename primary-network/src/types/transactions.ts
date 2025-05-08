import { type Common, type pvmSerial } from "@avalabs/avalanchejs";

export type Transaction<TTx = Common.Transaction> = {
  unsignedTx: Common.UnsignedTx;
  tx: TTx;
};

export type AddPermissionlessDelegatorTx =
  Transaction<pvmSerial.AddPermissionlessDelegatorTx>;
