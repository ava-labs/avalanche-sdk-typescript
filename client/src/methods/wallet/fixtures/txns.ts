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
import { DefaultRequestMultipartBody, http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { privateKeyToAvalancheAccount } from "src/accounts";
import { testContext } from "./testContext";

export const privateKey1ForTest =
  "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce";
export const privateKey2ForTest =
  "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027";
export const privateKey3ForTest =
  "0x27fb5ca2bb6289b517da89cc4f762ea24767d86735d65f93932f88680d18c5cb";
export const privateKey4ForTest =
  "0x7a06c9a812887da2a8eef298ab95f5b4d3a7301d192a924e349a9d300ed8f9f0";

export const account1 = privateKeyToAvalancheAccount(privateKey1ForTest);
export const account2 = privateKeyToAvalancheAccount(privateKey2ForTest);
export const account3 = privateKeyToAvalancheAccount(privateKey3ForTest);
export const account4 = privateKeyToAvalancheAccount(privateKey4ForTest);

export const signedWarpMsgL1ValidatorWeightHex =
  "0x0000000000056b804f574b890cf9e0cb0f0f68591a394bba1696cf62b4e576e793d8509cc88600000058000000000001000000140feedc0de0000000000000000000000000000000000000360000000000038ccf9ef520784d2fa5d97fbf098b8b4e82ff19408ec423c2970a522ab04b3a0400000000000000040000000000000029000000000000000106a8206d76cf3fa7d65fec8464b0311dce9283d05bcf0ca7987cdf03a3a2f764691e01df4f6aaa3ff6b52e5b92fd3291e519f3fb50bad5d9697a39e34e2c3e99ea585f0332e9d13b4b6db7ecc58eee44c7f96e64371b1eebaa6f7c45bbf0937e68";

export const signatureBytes = new Uint8Array([
  0x8b, 0x1d, 0x61, 0x33, 0xd1, 0x7e, 0x34, 0x83, 0x22, 0x0a, 0xd9, 0x60, 0xb6,
  0xfd, 0xe1, 0x1e, 0x4e, 0x12, 0x14, 0xa8, 0xce, 0x21, 0xef, 0x61, 0x62, 0x27,
  0xe5, 0xd5, 0xee, 0xf0, 0x70, 0xd7, 0x50, 0x0e, 0x6f, 0x7d, 0x44, 0x52, 0xc5,
  0xa7, 0x60, 0x62, 0x0c, 0xc0, 0x67, 0x95, 0xcb, 0xe2, 0x18, 0xe0, 0x72, 0xeb,
  0xa7, 0x6d, 0x94, 0x78, 0x8d, 0x9d, 0x01, 0x17, 0x6c, 0xe4, 0xec, 0xad, 0xfb,
  0x96, 0xb4, 0x7f, 0x94, 0x22, 0x81, 0x89, 0x4d, 0xdf, 0xad, 0xd1, 0xc1, 0x74,
  0x3f, 0x7f, 0x54, 0x9f, 0x1d, 0x07, 0xd5, 0x9d, 0x55, 0x65, 0x59, 0x27, 0xf7,
  0x2b, 0xc6, 0xbf, 0x7c, 0x12,
]);
export const popSignatureHex = utils.bufferToHex(signatureBytes);
export const signedWarpMsgRegisterL1ValidatorHex =
  "0x0000000000057f78fe8ca06cefa186ef29c15231e45e1056cd8319ceca0695ca61099e610355000000d80000000000010000001433b9785e20ec582d5009965fb3346f1716e8a423000000b60000000000015e8b6e2e8155e93739f2fa6a7f8a32c6bb2e1dce2e471b56dcc60aac49bf34350000001447b37278e32917ffc6d2861b50dd9751b4016dd1b0d305fd70c376b0f5d4e6b9184728dcacb7390f477015690133a5632affab5701e9ebe61038d2e41373de53f4569fd60000000067d1ac310000000100000001380c1fb1db38f176b50e77eca240258e31a5b5e80000000100000001380c1fb1db38f176b50e77eca240258e31a5b5e80000000000004e200000000000000003c4411899be0450aee4dcc1be90a8802bdbd12821a5025a74cb094ff0033982e7f3951d6c4b882a6ce39bd2aa835b31accd09c60f26bc75308af4e05c4237df9b72b04c2697c5a0a7fb0f05f7b09358743a4a2df8cd4eda61f0dea0312a7014baa8a5c1";

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
  txnId = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi"
): string[] => {
  const account2 = privateKeyToAvalancheAccount(privateKey2ForTest);
  const account1 = privateKeyToAvalancheAccount(privateKey1ForTest);
  if (owners.includes(account2.getXPAddress("P", "fuji"))) {
    owners = [
      account1.getXPAddress("P", "fuji"),
      account2.getXPAddress("P", "fuji"),
    ];
    threshold = 2;
    txnId = "DkMZoMW72jshkydBtcnngSxZtiWTBbcQowy3RoVvbcBjGSVh6";
  }
  const manager = utils.getManagerForVM("PVM");

  const utxo = getValidUTXO(amt, assetId, owners, locktime, threshold, txnId);
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

export const getPChainMockServer = (params: {
  overrideMocker?: Record<
    string,
    (
      reqBody: Record<string, any> | DefaultRequestMultipartBody
    ) => HttpResponse<any>
  >;
  url?: string;
}) => {
  const { overrideMocker, url } = params;
  const urlToUse = url || "https://api.avax-test.network/ext/bc/P";
  return setupServer(
    http.post(urlToUse, async ({ request }) => {
      const reqBody = await request.json();
      if (typeof reqBody === "object") {
        const method = reqBody?.["method"];
        switch (method) {
          case "platform.getUTXOs":
            return overrideMocker?.[method]
              ? overrideMocker?.[method](reqBody as Record<string, any>)
              : getDefaultGetUTXOsMockResponse(reqBody as Record<string, any>);
          case "platform.getFeeState":
            return overrideMocker?.[method]
              ? overrideMocker?.[method](reqBody as Record<string, any>)
              : getDefaultGetFeeStateMockResponse(
                  reqBody as Record<string, any>
                );
          case "platform.getTx":
            return overrideMocker?.[method]
              ? overrideMocker?.[method](reqBody as Record<string, any>)
              : getDefaultGetTxMockResponse(reqBody as Record<string, any>);
          case "platform.getL1Validator":
            return overrideMocker?.[method]
              ? overrideMocker?.[method](reqBody as Record<string, any>)
              : getDefaultGetL1ValidatorMockResponse(
                  reqBody as Record<string, any>
                );
          default:
            return HttpResponse.json(
              {
                message: "Mocked status",
              },
              { status: 500 }
            );
        }
      }

      return HttpResponse.json(
        {
          message: "Failed to parse request body",
        },
        {
          status: 500,
          statusText: "Mocked status",
        }
      );
    })
  );
};

export const getDefaultGetUTXOsMockResponse = (
  reqBody: Record<string, any> | DefaultRequestMultipartBody,
  testInputAmount: number = 1
) => {
  return HttpResponse.json({
    jsonrpc: "2.0",
    result: {
      numFetched: "1",
      utxos: getUTXOStrings(
        testInputAmount,
        testContext.avaxAssetID,
        reqBody?.["params"]?.["addresses"] || [
          "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz",
        ],
        0,
        1
      ),
      endIndex: {
        address:
          reqBody?.["params"]?.["addresses"]?.[0] ||
          "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz",
        utxo: "2iz1aRvPX2XPW7XLs6Nay9ECqtsWHVt1iEUnMKHskrsguZ14hi",
      },
      encoding: "hex",
    },
    id: reqBody?.["id"] || 1,
  });
};

export const getDefaultGetFeeStateMockResponse = (
  reqBody: Record<string, any> | DefaultRequestMultipartBody
) => {
  const feeStateData = feeState();
  return HttpResponse.json({
    jsonrpc: "2.0",
    result: {
      capacity: feeStateData.capacity.toString(),
      excess: feeStateData.excess.toString(),
      price: feeStateData.price.toString(),
      timestamp: feeStateData.timestamp,
    },
    id: reqBody?.["id"] || 1,
  });
};

export const getDefaultGetTxMockResponse = (
  reqBody: Record<string, any> | DefaultRequestMultipartBody
) => {
  if (
    reqBody?.["params"]?.["txID"] ===
    "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH"
  ) {
    return HttpResponse.json({
      jsonrpc: "2.0",
      result: {
        tx: "0x000000000010000000050000000000000000000000000000000000000000000000000000000000000000000000013d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa0000000700000000001e1d26000000000000000000000001000000012a705f0a71d8b6e19d5e955b19d683ca6d68237000000001e24544f6fd3abaa362b4c635d5c5dec16ac57a853477a1be41ae8e464d82005d000000003d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa0000000500000000001e31390000000100000000000000000000000b000000000000007b00000001000000012a705f0a71d8b6e19d5e955b19d683ca6d6823700000000100000009000000012df65b239996df9eaaeb235223a9e571832270e718a4be27317656965917d2080450e9aaf2141073bb1c4dab959fec0e8bb9dcb5dbf9f372160d0cb8c000f01401509d618f",
        encoding: "hex",
      },
      id: reqBody?.["id"] || 1,
    });
  } else if (
    reqBody?.["params"]?.["txID"] ===
    "SLomSuJLyG9qk7KLcWevdcZ1i7kN2qTLNUytJLhkwPdxAAgoa"
  ) {
    return HttpResponse.json({
      jsonrpc: "2.0",
      result: {
        tx: "0x000000000010000000050000000000000000000000000000000000000000000000000000000000000000000000013d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa00000007000000000000ef54000000000000000000000001000000012a705f0a71d8b6e19d5e955b19d683ca6d682370000000012677461b127dc02dfc789c599fd38917089842c4f043a98786b1db07fea6e09e000000003d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa0000000500000000000103670000000100000000000000000000000b000000000000007b00000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c000000010000000900000001115afe7403829dd5dde8d6d15702543feeb9bb689c2e611515677cfa3d7bc51038d0c99d77ee06af450318f0e343cb414c3419758f0e12cafb24abb4f16c53c10081b39a2b",
        encoding: "hex",
      },
      id: reqBody?.["id"] || 1,
    });
  }
  return HttpResponse.json(
    {
      jsonrpc: "2.0",
      result: {
        tx: "0x00", // empty tx
        encoding: "hex",
      },
      id: reqBody?.["id"] || 1,
    },
    {
      status: 500,
      statusText: "Mocked status",
    }
  );
};

export const getDefaultGetL1ValidatorMockResponse = (
  reqBody: Record<string, any> | DefaultRequestMultipartBody
) => {
  return HttpResponse.json({
    jsonrpc: "2.0",
    result: {
      subnetID: "11111111111111111111111111111111LpoYY",
      nodeID: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      publicKey:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      remainingBalanceOwner: {
        addresses: [account1.getXPAddress("P", "fuji")],
        locktime: "0",
        threshold: "1",
      },
      deactivationOwner: {
        addresses: [account1.getXPAddress("P", "fuji")],
        locktime: "0",
        threshold: "1",
      },
      startTime: "1716883200",
      weight: "100000",
    },
    id: reqBody?.["id"] || 1,
  });
};
