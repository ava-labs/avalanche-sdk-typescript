# SubscriptionsResponse

## Example Usage

```typescript
import { SubscriptionsResponse } from "@avalanche-sdk/data/models/components";

let value: SubscriptionsResponse = {
  email: "Brooke_Wehner@yahoo.com",
  subscriptions: {
    "NodeID-1": {
      notifications: [
        "connectivity",
      ],
    },
    "NodeID-2": {
      notifications: [
        "connectivity",
        "ports",
        "version",
      ],
    },
  },
};
```

## Fields

| Field                                                                                                                            | Type                                                                                                                             | Required                                                                                                                         | Description                                                                                                                      | Example                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `email`                                                                                                                          | *string*                                                                                                                         | :heavy_check_mark:                                                                                                               | The email address of the user                                                                                                    |                                                                                                                                  |
| `subscriptions`                                                                                                                  | Record<string, [components.Subscriptions](../../models/components/subscriptions.md)>                                             | :heavy_check_mark:                                                                                                               | The subscriptions of the user                                                                                                    | {<br/>"NodeID-1": {<br/>"notifications": [<br/>"connectivity"<br/>]<br/>},<br/>"NodeID-2": {<br/>"notifications": [<br/>"connectivity",<br/>"ports",<br/>"version"<br/>]<br/>}<br/>} |