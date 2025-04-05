# Rewards
(*data.primaryNetwork.rewards*)

## Overview

### Available Operations

* [listPendingRewards](#listpendingrewards) - List pending rewards
* [listHistoricalRewards](#listhistoricalrewards) - List historical rewards

## listPendingRewards

Lists pending rewards on the Primary Network for the supplied addresses.

### Example Usage

```typescript
import { Avalanche } from "@avalanche-sdk/sdk";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.primaryNetwork.rewards.listPendingRewards({
    addresses: "avax1h2ccj9f5ay5acl6tyn9mwmw32p8wref8vl8ctg",
    network: "mainnet",
    nodeIds: "NodeID-111111111111111111116DBWJs,NodeID-222222222222222222227DBWJs",
    sortOrder: "asc",
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
import { AvalancheCore } from "@avalanche-sdk/sdk/core.js";
import { dataPrimaryNetworkRewardsListPendingRewards } from "@avalanche-sdk/sdk/funcs/dataPrimaryNetworkRewardsListPendingRewards.js";

// Use `AvalancheCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const avalanche = new AvalancheCore({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const res = await dataPrimaryNetworkRewardsListPendingRewards(avalanche, {
    addresses: "avax1h2ccj9f5ay5acl6tyn9mwmw32p8wref8vl8ctg",
    network: "mainnet",
    nodeIds: "NodeID-111111111111111111116DBWJs,NodeID-222222222222222222227DBWJs",
    sortOrder: "asc",
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
| `request`                                                                                                                                                                      | [operations.ListPendingPrimaryNetworkRewardsRequest](../../models/operations/listpendingprimarynetworkrewardsrequest.md)                                                       | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |
| `options.serverURL`                                                                                                                                                            | *string*                                                                                                                                                                       | :heavy_minus_sign:                                                                                                                                                             | An optional server URL to use.                                                                                                                                                 |

### Response

**Promise\<[operations.ListPendingPrimaryNetworkRewardsResponse](../../models/operations/listpendingprimarynetworkrewardsresponse.md)\>**

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

## listHistoricalRewards

Lists historical rewards on the Primary Network for the supplied addresses.

### Example Usage

```typescript
import { Avalanche } from "@avalanche-sdk/sdk";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.primaryNetwork.rewards.listHistoricalRewards({
    addresses: "avax1h2ccj9f5ay5acl6tyn9mwmw32p8wref8vl8ctg",
    network: "mainnet",
    nodeIds: "NodeID-111111111111111111116DBWJs,NodeID-222222222222222222227DBWJs",
    sortOrder: "asc",
    currency: "usd",
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
import { AvalancheCore } from "@avalanche-sdk/sdk/core.js";
import { dataPrimaryNetworkRewardsListHistoricalRewards } from "@avalanche-sdk/sdk/funcs/dataPrimaryNetworkRewardsListHistoricalRewards.js";

// Use `AvalancheCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const avalanche = new AvalancheCore({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const res = await dataPrimaryNetworkRewardsListHistoricalRewards(avalanche, {
    addresses: "avax1h2ccj9f5ay5acl6tyn9mwmw32p8wref8vl8ctg",
    network: "mainnet",
    nodeIds: "NodeID-111111111111111111116DBWJs,NodeID-222222222222222222227DBWJs",
    sortOrder: "asc",
    currency: "usd",
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
| `request`                                                                                                                                                                      | [operations.ListHistoricalPrimaryNetworkRewardsRequest](../../models/operations/listhistoricalprimarynetworkrewardsrequest.md)                                                 | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |
| `options.serverURL`                                                                                                                                                            | *string*                                                                                                                                                                       | :heavy_minus_sign:                                                                                                                                                             | An optional server URL to use.                                                                                                                                                 |

### Response

**Promise\<[operations.ListHistoricalPrimaryNetworkRewardsResponse](../../models/operations/listhistoricalprimarynetworkrewardsresponse.md)\>**

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