# DeactivateWebhookResponse

Successful response


## Supported Types

### `components.EVMAddressActivityResponse`

```typescript
const value: components.EVMAddressActivityResponse = {
  id: "<id>",
  url: "https://gruesome-waterspout.net",
  chainId: "<id>",
  status: "inactive",
  createdAt: 8215.82,
  name: "<value>",
  description: "inventory which regarding",
  eventType: "address_activity",
  metadata: {
    eventSignatures: [
      "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
    ],
    addresses: [
      "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    ],
  },
};
```

### `components.PrimaryNetworkAddressActivityResponse`

```typescript
const value: components.PrimaryNetworkAddressActivityResponse = {
  id: "<id>",
  url: "https://general-babushka.biz/",
  chainId: "<id>",
  status: "inactive",
  createdAt: 6579.99,
  name: "<value>",
  description: "mmm tabulate especially under inside youthfully since word",
  eventType: "primary_network_address_activity",
  metadata: {
    eventSignatures: [
      "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
    ],
    keyType: "addresses",
    keys: [
      "<value 1>",
    ],
    subEvents: {
      addressActivitySubEvents: [],
    },
  },
};
```

### `components.ValidatorActivityResponse`

```typescript
const value: components.ValidatorActivityResponse = {
  id: "<id>",
  url: "https://juvenile-abacus.info/",
  chainId: "<id>",
  status: "inactive",
  createdAt: 5002.48,
  name: "<value>",
  description: "stiffen but behind flat supposing realistic",
  eventType: "validator_activity",
  metadata: {
    eventSignatures: [
      "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
    ],
    keyType: "subnetId",
    keys: [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
    subEvents: {
      validatorActivitySubEvents: [],
    },
  },
};
```

