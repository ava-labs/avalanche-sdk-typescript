# ListChainsResponse

## Example Usage

```typescript
import { ListChainsResponse } from "@avalanche-sdk/metrics/models/components";

let value: ListChainsResponse = {
  chains: [],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `chains`                                                                                                                               | [components.Chain](../../models/components/chain.md)[]                                                                                 | :heavy_check_mark:                                                                                                                     | Array of Subnet - EVM Chain ID mappings whose metrics we support.                                                                      |