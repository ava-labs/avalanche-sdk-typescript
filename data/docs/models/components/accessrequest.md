# AccessRequest

## Example Usage

```typescript
import { AccessRequest } from "@avalanche-sdk/data/models/components";

let value: AccessRequest = {
  email: "Jordyn69@yahoo.com",
  captcha: "<value>",
};
```

## Fields

| Field                                         | Type                                          | Required                                      | Description                                   |
| --------------------------------------------- | --------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| `email`                                       | *string*                                      | :heavy_check_mark:                            | The email address to send the access token to |
| `captcha`                                     | *string*                                      | :heavy_check_mark:                            | The captcha to verify the user                |