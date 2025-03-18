# AddressActivityMetadata

## Example Usage

```typescript
import { AddressActivityMetadata } from "@avalanche-sdk/webhooks/models/components";

let value: AddressActivityMetadata = {
  addresses: [
    "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  ],
  eventSignatures: [
    "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
  ],
};
```

## Fields

| Field                                                                    | Type                                                                     | Required                                                                 | Description                                                              | Example                                                                  |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `addresses`                                                              | *string*[]                                                               | :heavy_check_mark:                                                       | Ethereum address(es) for the address_activity event type                 | [<br/>"0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"<br/>]                 |
| `eventSignatures`                                                        | *string*[]                                                               | :heavy_minus_sign:                                                       | Array of hexadecimal strings of the event signatures.                    | [<br/>"0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64"<br/>] |