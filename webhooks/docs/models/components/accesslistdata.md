# AccessListData

## Example Usage

```typescript
import { AccessListData } from "@avalanche-sdk/webhooks/models/components";

let value: AccessListData = {
  accessAddresses: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
  storageKeys: [
    "<value 1>",
  ],
};
```

## Fields

| Field                                      | Type                                       | Required                                   | Description                                | Example                                    |
| ------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------------ |
| `accessAddresses`                          | *string*                                   | :heavy_check_mark:                         | Access Address                             | 0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7 |
| `storageKeys`                              | *string*[]                                 | :heavy_check_mark:                         | Storage keys                               |                                            |