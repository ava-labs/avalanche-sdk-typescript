# BadRequestError

## Example Usage

```typescript
import { BadRequestError } from "@avalanche-sdk/webhooks/models/errors";

// No examples available for this model
```

## Fields

| Field                                                     | Type                                                      | Required                                                  | Description                                               | Example                                                   |
| --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| `message`                                                 | *errors.BadRequestMessage*                                | :heavy_check_mark:                                        | The error message describing the reason for the exception |                                                           |
| `statusCode`                                              | *number*                                                  | :heavy_check_mark:                                        | The HTTP status code of the response                      | 400                                                       |
| `error`                                                   | *string*                                                  | :heavy_check_mark:                                        | The type of error                                         | Bad Request                                               |