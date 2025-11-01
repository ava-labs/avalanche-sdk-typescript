# PrimaryNetworkAddressesBodyDto

## Example Usage

```typescript
import { PrimaryNetworkAddressesBodyDto } from "@avalanche-sdk/chainkit/models/components";

let value: PrimaryNetworkAddressesBodyDto = {
  addresses: "P-avax1abc123,X-avax1def456,C-avax1ghi789",
};
```

## Fields

| Field                                             | Type                                              | Required                                          | Description                                       | Example                                           |
| ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `addresses`                                       | *string*                                          | :heavy_check_mark:                                | Comma-separated list of primary network addresses | P-avax1abc123,X-avax1def456,C-avax1ghi789         |