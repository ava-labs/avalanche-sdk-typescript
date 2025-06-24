# ChainAddressChainIdMap

## Example Usage

```typescript
import { ChainAddressChainIdMap } from "@avalanche-sdk/devtools/models/components";

let value: ChainAddressChainIdMap = {
  address: "52144 Wendy Hills",
  blockchainIds: [
    "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
  ],
};
```

## Fields

| Field                                                                  | Type                                                                   | Required                                                               | Description                                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `address`                                                              | *string*                                                               | :heavy_check_mark:                                                     | N/A                                                                    |
| `blockchainIds`                                                        | [components.BlockchainIds](../../models/components/blockchainids.md)[] | :heavy_check_mark:                                                     | N/A                                                                    |