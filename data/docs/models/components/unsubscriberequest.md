# UnsubscribeRequest

## Example Usage

```typescript
import { UnsubscribeRequest } from "@avalanche-sdk/data/models/components";

let value: UnsubscribeRequest = {
  accessToken: "<value>",
  nodeId: "<id>",
};
```

## Fields

| Field                                      | Type                                       | Required                                   | Description                                |
| ------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------------ |
| `accessToken`                              | *string*                                   | :heavy_check_mark:                         | The access token to use for authentication |
| `nodeId`                                   | *string*                                   | :heavy_check_mark:                         | The node ID to subscribe to                |