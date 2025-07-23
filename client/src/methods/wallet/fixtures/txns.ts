import {
  Address,
  avaxSerial,
  BigIntPr,
  Id,
  Int,
  OutputOwners,
  pvm,
  TransferOutput,
  utils,
  Utxo,
} from "@avalabs/avalanchejs";
import { privateKeyToAvalancheAccount } from "src/accounts";

export const privateKey1ForTest =
  "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce";
export const privateKey2ForTest =
  "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027";
export const privateKey3ForTest =
  "0x27fb5ca2bb6289b517da89cc4f762ea24767d86735d65f93932f88680d18c5cb";
export const privateKey4ForTest =
  "0x7a06c9a812887da2a8eef298ab95f5b4d3a7301d192a924e349a9d300ed8f9f0";

export const feeState = (): pvm.FeeState => ({
  capacity: 999_999n,
  excess: 1n,
  price: 1n,
  timestamp: new Date().toISOString(),
});

export const getUTXOStrings = (
  amt = 50,
  assetId: string,
  owners: string[],
  locktime = 0,
  threshold = 1,
  utxoId = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi"
): string[] => {
  const account2 = privateKeyToAvalancheAccount(privateKey2ForTest);
  const account1 = privateKeyToAvalancheAccount(privateKey1ForTest);
  if (owners.includes(account2.getXPAddress("P", "fuji"))) {
    owners.push(account1.getXPAddress("P", "fuji"));
  }
  const manager = utils.getManagerForVM("PVM");

  const utxo = getValidUTXO(amt, assetId, owners, locktime, threshold, utxoId);
  const utxoHex = utils.bufferToHex(utxo.toBytes(manager.getDefaultCodec()));
  return [`0x000${utils.strip0x(utxoHex)}`];
};

export const getValidUTXO = (
  amt = 50,
  assetId: string,
  owners: string[],
  locktime = 0,
  threshold = 1,
  utxoId = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi"
) => {
  const bigIntAmount = new BigIntPr(BigInt(amt * 1e9));
  const ownerAddresses = owners.map((owner) => Address.fromString(owner));

  return new Utxo(
    new avaxSerial.UTXOID(Id.fromString(utxoId), new Int(0)),
    Id.fromString(assetId),
    new TransferOutput(
      bigIntAmount,
      new OutputOwners(
        new BigIntPr(BigInt(locktime)),
        new Int(threshold),
        ownerAddresses
      )
    )
  );
};
