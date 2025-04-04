# LookingGlassResponse

## Example Usage

```typescript
import { LookingGlassResponse } from "@avalanche-sdk/devtools/models/components";

let value: LookingGlassResponse = {
  addresses: [
    {
      address: "0x1234567890abcdef1234567890abcdef123456789",
      sortKey: "123",
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `addresses`                                                                                                                            | [components.AddressDetails](../../models/components/addressdetails.md)[]                                                               | :heavy_check_mark:                                                                                                                     | List of addresses that match provided criteria.                                                                                        |