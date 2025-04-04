# LookingGlass
(*lookingGlass*)

## Overview

Looking Glass is a tool that allows users to look up information for future airdrops.

### Available Operations

* [compositeQuery](#compositequery) - Composite query

## compositeQuery

Composite query to get list of addresses from multiple subqueries.

### Example Usage

```typescript
import { Avalanche } from "@avalanche-sdk/devtools";

const avalanche = new Avalanche({
  serverURL: "https://api.example.com",
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.lookingGlass.compositeQuery({
    queries: [
      {
        id: "<id>",
        type: "AllTimeStarsArenaBalance",
        params: {
          firstDate: "<value>",
          lastDate: "<value>",
          minBalance: "<value>",
          subjectAddress: "<value>",
        },
      },
      {
        id: "<id>",
        type: "AnyTimeStarsArenaBalance",
        params: {
          firstDate: "<value>",
          lastDate: "<value>",
          minBalance: "<value>",
          subjectAddress: "<value>",
        },
      },
      {
        id: "<id>",
        type: "AllTimeStarsArenaBalance",
        params: {
          firstDate: "<value>",
          lastDate: "<value>",
          minBalance: "<value>",
          subjectAddress: "<value>",
        },
      },
    ],
    operator: "OR",
  });

  for await (const page of result) {
    // Handle the page
    console.log(page);
  }
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AvalancheCore } from "@avalanche-sdk/devtools/core.js";
import { lookingGlassCompositeQuery } from "@avalanche-sdk/devtools/funcs/lookingGlassCompositeQuery.js";

// Use `AvalancheCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const avalanche = new AvalancheCore({
  serverURL: "https://api.example.com",
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const res = await lookingGlassCompositeQuery(avalanche, {
    queries: [
      {
        id: "<id>",
        type: "AllTimeStarsArenaBalance",
        params: {
          firstDate: "<value>",
          lastDate: "<value>",
          minBalance: "<value>",
          subjectAddress: "<value>",
        },
      },
      {
        id: "<id>",
        type: "AnyTimeStarsArenaBalance",
        params: {
          firstDate: "<value>",
          lastDate: "<value>",
          minBalance: "<value>",
          subjectAddress: "<value>",
        },
      },
      {
        id: "<id>",
        type: "AllTimeStarsArenaBalance",
        params: {
          firstDate: "<value>",
          lastDate: "<value>",
          minBalance: "<value>",
          subjectAddress: "<value>",
        },
      },
    ],
    operator: "OR",
  });

  if (!res.ok) {
    throw res.error;
  }

  const { value: result } = res;

  for await (const page of result) {
    // Handle the page
    console.log(page);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [components.CompositeQueryRequestDto](../../models/components/compositequeryrequestdto.md)                                                                                     | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |
| `options.serverURL`                                                                                                                                                            | *string*                                                                                                                                                                       | :heavy_minus_sign:                                                                                                                                                             | An optional server URL to use.                                                                                                                                                 |

### Response

**Promise\<[operations.CompositeQueryV2Response](../../models/operations/compositequeryv2response.md)\>**

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