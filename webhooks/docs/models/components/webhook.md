# Webhook


## Supported Types

### `components.EVMAddressActivityResponse`

```typescript
const value: components.EVMAddressActivityResponse = {
  id: "<id>",
  eventType: "validator_activity",
  url: "https://wordy-shore.net/",
  chainId: "<id>",
  status: "inactive",
  createdAt: 967.63,
  name: "<value>",
  description: "uh-huh scornful scratchy noted issue um",
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
  eventType: "address_activity",
  url: "https://square-meatloaf.info",
  chainId: "<id>",
  status: "active",
  createdAt: 1034.49,
  name: "<value>",
  description: "unethically save physical nucleotidase finally",
  metadata: {
    keyType: "addresses",
    keys: [
      "<value 1>",
      "<value 2>",
    ],
    eventSignatures: [
      "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
    ],
  },
};
```

