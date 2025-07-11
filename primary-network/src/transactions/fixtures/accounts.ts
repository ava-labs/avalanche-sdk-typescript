import { Address } from "@avalabs/avalanchejs";

export const pAddressForTest = 'P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz'
export const xAddressForTest = 'X-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz'
export const publicKeyForTest = '0x0245ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208'
export const privateKeyForTest = '0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce'
export const testOwnerPAddress = Address.fromString(pAddressForTest);

export const pAddressForTest2 = 'P-fuji1pq96td5wmyjsgzl0vrcpk45p86p5ksh76hr7vk'
export const xAddressForTest2 = 'X-fuji1pq96td5wmyjsgzl0vrcpk45p86p5ksh76hr7vk'
export const publicKeyForTest2 = '0x03c75452cd6069adb6775f51a9169c3d2f074157028970a72621165f92f586bb65'
export const privateKeyForTest2 = '0x9c31046749e2f8f9815b278023b0efb3d7561e1919c9afa9a088376f4cbe577c'
export const testOwnerPAddress2 = Address.fromString(pAddressForTest2);

export const pAddressForTest3 = 'P-fuji1jvvg09q06rhkzte25shumjz4vszm0em84hetzn'
export const xAddressForTest3 = 'X-fuji1jvvg09q06rhkzte25shumjz4vszm0em84hetzn'
export const publicKeyForTest3 = '0x02a1a17c6e06e24a65e4d7d596bbfb8333220abde9ab2c70d6ba4465d87f720e11'
export const privateKeyForTest3 = '0x27fb5ca2bb6289b517da89cc4f762ea24767d86735d65f93932f88680d18c5cb'
export const testOwnerPAddress3 = Address.fromString(pAddressForTest3);

export const pAddressForTest4 = 'P-fuji12v456enlxznlwrvq3favqt0t2zawk28u80y23n'
export const xAddressForTest4 = 'X-fuji12v456enlxznlwrvq3favqt0t2zawk28u80y23n'
export const publicKeyForTest4 = '0x025004c8cafdc4c0c125292cc392b556a8efc4cbf386c60e8c151f8fd9975995d2'
export const privateKeyForTest4 = '0x7a06c9a812887da2a8eef298ab95f5b4d3a7301d192a924e349a9d300ed8f9f0'
export const testOwnerPAddress4 = Address.fromString(pAddressForTest4);

export type PChainTestAccount = {
    pAddress: string,
    privateKey: string,
    address: Address,
    publicKey: string,
}

export type XChainTestAccount = {
    xAddress: string,
    privateKey: string,
    address: Address,
    publicKey: string,
}

export const PChainAccounts: PChainTestAccount[] = [
    {
        pAddress: pAddressForTest,
        privateKey: privateKeyForTest,
        address: testOwnerPAddress,
        publicKey: publicKeyForTest,
    },
    {
        pAddress: pAddressForTest2,
        privateKey: privateKeyForTest2,
        address: testOwnerPAddress2,
        publicKey: publicKeyForTest2,
    },
    {
        pAddress: pAddressForTest3,
        privateKey: privateKeyForTest3,
        address: testOwnerPAddress3,
        publicKey: publicKeyForTest3,
    },
    {
        pAddress: pAddressForTest4,
        privateKey: privateKeyForTest4,
        address: testOwnerPAddress4,
        publicKey: publicKeyForTest4,
    },
]

export const XChainAccounts: XChainTestAccount[] = [
    {
        xAddress: xAddressForTest,
        privateKey: privateKeyForTest,
        address: testOwnerPAddress,
        publicKey: publicKeyForTest,
    },
    {
        xAddress: xAddressForTest2,
        privateKey: privateKeyForTest2,
        address: testOwnerPAddress2,
        publicKey: publicKeyForTest2,
    },
    {
        xAddress: xAddressForTest3,
        privateKey: privateKeyForTest3,
        address: testOwnerPAddress3,
        publicKey: publicKeyForTest3,
    },
    {
        xAddress: xAddressForTest4,
        privateKey: privateKeyForTest4,
        address: testOwnerPAddress4,
        publicKey: publicKeyForTest4,
    },
]
