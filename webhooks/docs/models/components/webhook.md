# Webhook


## Supported Types

### `components.EVMAddressActivityResponse`

```typescript
const value: components.EVMAddressActivityResponse = {
  id: "<id>",
  eventType: "platform_address_activity",
  url: "https://hidden-hubris.org",
  chainId: "<id>",
  status: "inactive",
  createdAt: 7038.89,
  name: "<value>",
  description: "queasily ha intensely",
  metadata: {
    addresses: [
      "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    ],
    eventSignatures: [
      "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
    ],
  },
};
```

### `components.PlatformActivityResponse`

```typescript
const value: components.PlatformActivityResponse = {
  id: "<id>",
  eventType: "validator_activity",
  url: "https://misguided-avalanche.biz/",
  chainId: "<id>",
  status: "active",
  createdAt: 7936.98,
  name: "<value>",
  description: "overcharge general astride boohoo",
  metadata: {
    keyType: "addresses",
    keys: [
      "<value>",
    ],
    eventSignatures: [
      "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
    ],
  },
};
```

