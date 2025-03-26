# Addresses
(*webhooks.addresses*)

## Overview

### Available Operations

* [add](#add) - Add addresses to EVM activity webhook
* [remove](#remove) - Remove addresses from EVM activity  webhook
* [list](#list) - List adresses by EVM activity webhooks

## add

Add addresses to webhook. Only valid for EVM activity webhooks.

### Example Usage

```typescript
import { Avalanche } from "@avalanche-sdk/sdk/webhooks";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.webhooks.addresses.add({
    id: "f33de69c-d13b-4691-908f-870d6e2e6b04",
    addressesChangeRequest: {
      addresses: [
        "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      ],
    },
  });

  // Handle the result
  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AvalancheCore } from "@avalanche-sdk/sdk/webhooks/core.js";
import { webhooksAddressesAdd } from "@avalanche-sdk/sdk/webhooks/funcs/webhooksAddressesAdd.js";

// Use `AvalancheCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const avalanche = new AvalancheCore({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const res = await webhooksAddressesAdd(avalanche, {
    id: "f33de69c-d13b-4691-908f-870d6e2e6b04",
    addressesChangeRequest: {
      addresses: [
        "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      ],
    },
  });

  if (!res.ok) {
    throw res.error;
  }

  const { value: result } = res;

  // Handle the result
  console.log(result);
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.AddAddressesToWebhookRequest](../../models/operations/addaddressestowebhookrequest.md)                                                                             | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[components.EVMAddressActivityResponse](../../models/components/evmaddressactivityresponse.md)\>**

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

## remove

Remove addresses from webhook. Only valid for EVM activity webhooks.

### Example Usage

```typescript
import { Avalanche } from "@avalanche-sdk/sdk/webhooks";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.webhooks.addresses.remove({
    id: "f33de69c-d13b-4691-908f-870d6e2e6b04",
    addressesChangeRequest: {
      addresses: [
        "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      ],
    },
  });

  // Handle the result
  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { AvalancheCore } from "@avalanche-sdk/sdk/webhooks/core.js";
import { webhooksAddressesRemove } from "@avalanche-sdk/sdk/webhooks/funcs/webhooksAddressesRemove.js";

// Use `AvalancheCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const avalanche = new AvalancheCore({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const res = await webhooksAddressesRemove(avalanche, {
    id: "f33de69c-d13b-4691-908f-870d6e2e6b04",
    addressesChangeRequest: {
      addresses: [
        "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      ],
    },
  });

  if (!res.ok) {
    throw res.error;
  }

  const { value: result } = res;

  // Handle the result
  console.log(result);
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.RemoveAddressesFromWebhookRequest](../../models/operations/removeaddressesfromwebhookrequest.md)                                                                   | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[components.EVMAddressActivityResponse](../../models/components/evmaddressactivityresponse.md)\>**

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

## list

List adresses by webhook. Only valid for EVM activity webhooks.

### Example Usage

```typescript
import { Avalanche } from "@avalanche-sdk/sdk/webhooks";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.webhooks.addresses.list({
    id: "f33de69c-d13b-4691-908f-870d6e2e6b04",
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
import { AvalancheCore } from "@avalanche-sdk/sdk/webhooks/core.js";
import { webhooksAddressesList } from "@avalanche-sdk/sdk/webhooks/funcs/webhooksAddressesList.js";

// Use `AvalancheCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const avalanche = new AvalancheCore({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const res = await webhooksAddressesList(avalanche, {
    id: "f33de69c-d13b-4691-908f-870d6e2e6b04",
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
| `request`                                                                                                                                                                      | [operations.GetAddressesFromWebhookRequest](../../models/operations/getaddressesfromwebhookrequest.md)                                                                         | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.GetAddressesFromWebhookResponse](../../models/operations/getaddressesfromwebhookresponse.md)\>**

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