# AVAXSupply

## Overview

Find information about AVAX supply.

### Available Operations

* [get](#get) - Get AVAX supply information

## get

Get AVAX supply information that includes  total supply, circulating supply, total p burned, total c burned,  total x burned, total staked, total locked, total rewards,  and last updated.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="getAvaxSupply" method="get" path="/v1/avax/supply" -->
```typescript
import { Avalanche } from "@avalanche-sdk/chainkit";

const avalanche = new Avalanche();

async function run() {
  const result = await avalanche.avaxSupply.get();

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AvalancheCore } from "@avalanche-sdk/chainkit/core.js";
import { avaxSupplyGet } from "@avalanche-sdk/chainkit/funcs/avaxSupplyGet.js";

// Use `AvalancheCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const avalanche = new AvalancheCore();

async function run() {
  const res = await avaxSupplyGet(avalanche);
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("avaxSupplyGet failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |
| `options.serverURL`                                                                                                                                                            | *string*                                                                                                                                                                       | :heavy_minus_sign:                                                                                                                                                             | An optional server URL to use.                                                                                                                                                 |

### Response

**Promise\<[components.AvaxSupplyResponse](../../models/components/avaxsupplyresponse.md)\>**

### Errors

| Error Type                     | Status Code                    | Content Type                   |
| ------------------------------ | ------------------------------ | ------------------------------ |
| errors.BadRequestError         | 400                            | application/json               |
| errors.UnauthorizedError       | 401                            | application/json               |
| errors.ForbiddenError          | 403                            | application/json               |
| errors.NotFoundError           | 404                            | application/json               |
| errors.TooManyRequestsError    | 429                            | application/json               |
| errors.InternalServerError     | 500                            | application/json               |
| errors.BadGatewayError         | 502                            | application/json               |
| errors.ServiceUnavailableError | 503                            | application/json               |
| errors.AvalancheAPIError       | 4XX, 5XX                       | \*/\*                          |