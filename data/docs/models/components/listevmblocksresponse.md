# ListEvmBlocksResponse

## Example Usage

```typescript
import { ListEvmBlocksResponse } from "@avalanche-sdk/data/models/components";

let value: ListEvmBlocksResponse = {
  blocks: [],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `blocks`                                                                                                                               | [components.EvmBlock](../../models/components/evmblock.md)[]                                                                           | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |