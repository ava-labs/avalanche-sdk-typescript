import { pvm, utils } from "@avalabs/avalanchejs";
import { privateKeyToAvalancheAccount } from "../../../../accounts";

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
