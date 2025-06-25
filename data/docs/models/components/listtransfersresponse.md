# ListTransfersResponse

## Example Usage

```typescript
import { ListTransfersResponse } from "@avalanche-sdk/data/models/components";

let value: ListTransfersResponse = {
  transfers: [],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `transfers`                                                                                                                            | *components.Transfer*[]                                                                                                                | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |