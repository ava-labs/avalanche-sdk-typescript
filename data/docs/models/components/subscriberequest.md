# SubscribeRequest

## Example Usage

```typescript
import { SubscribeRequest } from "@avalanche-sdk/data/models/components";

let value: SubscribeRequest = {
  accessToken: "<value>",
  nodeId: "<id>",
  notifications: [
    "connectivity",
    "ports",
    "version",
  ],
};
```

## Fields

| Field                                                                                                 | Type                                                                                                  | Required                                                                                              | Description                                                                                           | Example                                                                                               |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `accessToken`                                                                                         | *string*                                                                                              | :heavy_check_mark:                                                                                    | The access token to use for authentication                                                            |                                                                                                       |
| `nodeId`                                                                                              | *string*                                                                                              | :heavy_check_mark:                                                                                    | The node ID to subscribe to                                                                           |                                                                                                       |
| `notifications`                                                                                       | [components.SubscribeRequestNotification](../../models/components/subscriberequestnotification.md)[]  | :heavy_minus_sign:                                                                                    | The notification types to subscribe to. If not provided, all notification types will be subscribed to | [<br/>"connectivity",<br/>"ports",<br/>"version"<br/>]                                                |