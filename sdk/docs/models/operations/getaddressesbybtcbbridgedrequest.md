# GetAddressesByBtcbBridgedRequest

## Example Usage

```typescript
import { GetAddressesByBtcbBridgedRequest } from "@avalanche-sdk/sdk/models/operations";

let value: GetAddressesByBtcbBridgedRequest = {
  threshold: "1000000",
};
```

## Fields

| Field                                                                                            | Type                                                                                             | Required                                                                                         | Description                                                                                      | Example                                                                                          |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `threshold`                                                                                      | *string*                                                                                         | :heavy_check_mark:                                                                               | The minimum balance for which addresses should be considered.                                    | 1000000                                                                                          |
| `pageToken`                                                                                      | *string*                                                                                         | :heavy_minus_sign:                                                                               | A page token, received from a previous list call. Provide this to retrieve the subsequent page.  |                                                                                                  |
| `pageSize`                                                                                       | *number*                                                                                         | :heavy_minus_sign:                                                                               | The maximum number of items to return. The minimum page size is 1. The maximum pageSize is 5000. | 10                                                                                               |