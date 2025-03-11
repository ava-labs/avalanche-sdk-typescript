# PChainLookingGlassResponse

## Example Usage

```typescript
import { PChainLookingGlassResponse } from "@avalanche-sdk/metrics/models/components";

let value: PChainLookingGlassResponse = {
  addresses: [
    {
      addresses: [
        "avax1abcdef1234567890abcdef1234567890abcdef",
      ],
      sortKey: "123",
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `addresses`                                                                                                                            | [components.PChainAddressDetails](../../models/components/pchainaddressdetails.md)[]                                                   | :heavy_check_mark:                                                                                                                     | List of addresses that match provided criteria.                                                                                        |