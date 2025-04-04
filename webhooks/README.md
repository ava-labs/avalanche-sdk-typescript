<div align="center">
    <h1> @avalanche-sdk/webhooks </h1>
        <p>
            The Avalanche Webhooks SDK is a powerful and flexible toolset designed to simplify the integration with Avalanche's suite of blockchain services.
        </p>
        <p> 
            Currently, this SDK is focused on providing robust support for Webhooks APIs.  
        </p>
        <a href="https://developers.avacloud.io/webhooks-api/overview">
            <img src="https://img.shields.io/static/v1?label=Docs&message=API Ref&color=3b6ef9&style=for-the-badge" />
        </a>
</div>

<!-- Start Summary [summary] -->

## Summary

Webhooks API: Webhooks API enables real-time monitoring of on-chain events across the Avalanche C-chain, subnets, and L1 networks. It provides instant notifications for activities like smart contract events, NFT transfers, and wallet transactions. Developers can customize filters to track specific events and verify notifications using shared secrets for security

<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->

## Table of Contents

<!-- $toc-max-depth=2 -->

* [SDK Installation](#sdk-installation)
* [Requirements](#requirements)
* [SDK Example Usage](#sdk-example-usage)
* [Authentication](#authentication)
* [Available Resources and Operations](#available-resources-and-operations)
* [Standalone functions](#standalone-functions)
* [Pagination](#pagination)
* [Retries](#retries)
* [Error Handling](#error-handling)
* [Server Selection](#server-selection)
* [Custom HTTP Client](#custom-http-client)
* [Debugging](#debugging)
* [Development](#development)
  * [Maturity](#maturity)
  * [Contributions](#contributions)

<!-- End Table of Contents [toc] -->

<!-- Start SDK Installation [installation] -->

## SDK Installation

The SDK can be installed with either [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/) or [yarn](https://classic.yarnpkg.com/en/) package managers.

### NPM

```bash
npm add @avalanche-sdk/webhooks
```

### PNPM

```bash
pnpm add @avalanche-sdk/webhooks
```

### Bun

```bash
bun add @avalanche-sdk/webhooks
```

### Yarn

```bash
yarn add @avalanche-sdk/webhooks zod

# Note that Yarn does not install peer dependencies automatically. You will need
# to install zod as shown above.
```

> [!NOTE]
> This package is published with CommonJS and ES Modules (ESM) support.

### Model Context Protocol (MCP) Server

This SDK is also an installable MCP server where the various SDK methods are
exposed as tools that can be invoked by AI applications.

> Node.js v20 or greater is required to run the MCP server from npm.

<details>
<summary>Claude installation steps</summary>

Add the following server definition to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "Avalanche": {
      "command": "npx",
      "args": [
        "-y", "--package", "@avalanche-sdk/webhooks",
        "--",
        "mcp", "start",
        "--api-key", "...",
        "--chain-id", "...",
        "--network", "..."
      ]
    }
  }
}
```

</details>

<details>
<summary>Cursor installation steps</summary>

Create a `.cursor/mcp.json` file in your project root with the following content:

```json
{
  "mcpServers": {
    "Avalanche": {
      "command": "npx",
      "args": [
        "-y", "--package", "@avalanche-sdk/webhooks",
        "--",
        "mcp", "start",
        "--api-key", "...",
        "--chain-id", "...",
        "--network", "..."
      ]
    }
  }
}
```

</details>

You can also run MCP servers as a standalone binary with no additional dependencies. You must pull these binaries from available Github releases:

```bash
curl -L -o mcp-server \
    https://github.com/{org}/{repo}/releases/download/{tag}/mcp-server-bun-darwin-arm64 && \
chmod +x mcp-server
```

If the repo is a private repo you must add your Github PAT to download a release `-H "Authorization: Bearer {GITHUB_PAT}"`.

```json
{
  "mcpServers": {
    "Todos": {
      "command": "./DOWNLOAD/PATH/mcp-server",
      "args": [
        "start"
      ]
    }
  }
}
```

For a full list of server arguments, run:

```sh
npx -y --package @avalanche-sdk/webhooks -- mcp start --help
```

<!-- End SDK Installation [installation] -->

<!-- Start Requirements [requirements] -->

## Requirements

For supported JavaScript runtimes, please consult [RUNTIMES.md](RUNTIMES.md).

<!-- End Requirements [requirements] -->

<!-- Start SDK Example Usage [usage] -->

## SDK Example Usage

### Example

```typescript
import { Avalanche } from "@avalanche-sdk/webhooks";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.webhooks.create({
    eventType: "validator_activity",
    url: "https://expensive-designation.info",
    chainId: "<id>",
    metadata: {
      keyType: "addresses",
      keys: [
        "<value>",
      ],
      eventSignatures: [
        "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
      ],
    },
  });

  // Handle the result
  console.log(result);
}

run();

```

<!-- End SDK Example Usage [usage] -->

<!-- Start Authentication [security] -->

## Authentication

### Per-Client Security Schemes

This SDK supports the following security scheme globally:

| Name       | Type   | Scheme  |
| ---------- | ------ | ------- |
| `apiKey` | apiKey | API key |

To authenticate with the API the `apiKey` parameter must be set when initializing the SDK client instance. For example:

```typescript
import { Avalanche } from "@avalanche-sdk/webhooks";

const avalanche = new Avalanche({
  apiKey: "<YOUR_API_KEY_HERE>",
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.webhooks.healthCheck();

  // Handle the result
  console.log(result);
}

run();

```

<!-- End Authentication [security] -->

<!-- Start Available Resources and Operations [operations] -->

## Available Resources and Operations

<details open>
<summary>Available methods</summary>

### [webhooks](docs/sdks/webhooks/README.md)

* [healthCheck](docs/sdks/webhooks/README.md#healthcheck) - Get the health of the service
* [create](docs/sdks/webhooks/README.md#create) - Create a webhook
* [list](docs/sdks/webhooks/README.md#list) - List webhooks
* [get](docs/sdks/webhooks/README.md#get) - Get a webhook by ID
* [deactivate](docs/sdks/webhooks/README.md#deactivate) - Deactivate a webhook
* [update](docs/sdks/webhooks/README.md#update) - Update a webhook
* [generateOrRotateSharedSecret](docs/sdks/webhooks/README.md#generateorrotatesharedsecret) - Generate or rotate a shared secret
* [getSharedSecret](docs/sdks/webhooks/README.md#getsharedsecret) - Get a shared secret

#### [webhooks.addresses](docs/sdks/addresses/README.md)

* [add](docs/sdks/addresses/README.md#add) - Add addresses to EVM activity webhook
* [remove](docs/sdks/addresses/README.md#remove) - Remove addresses from EVM activity  webhook
* [list](docs/sdks/addresses/README.md#list) - List adresses by EVM activity webhooks

</details>
<!-- End Available Resources and Operations [operations] -->

<!-- Start Standalone functions [standalone-funcs] -->

## Standalone functions

All the methods listed above are available as standalone functions. These
functions are ideal for use in applications running in the browser, serverless
runtimes or other environments where application bundle size is a primary
concern. When using a bundler to build your application, all unused
functionality will be either excluded from the final bundle or tree-shaken away.

To read more about standalone functions, check [FUNCTIONS.md](./FUNCTIONS.md).

<details>

<summary>Available standalone functions</summary>

- [`webhooksAddressesAdd`](docs/sdks/addresses/README.md#add) - Add addresses to EVM activity webhook
- [`webhooksAddressesList`](docs/sdks/addresses/README.md#list) - List adresses by EVM activity webhooks
- [`webhooksAddressesRemove`](docs/sdks/addresses/README.md#remove) - Remove addresses from EVM activity  webhook
- [`webhooksCreate`](docs/sdks/webhooks/README.md#create) - Create a webhook
- [`webhooksDeactivate`](docs/sdks/webhooks/README.md#deactivate) - Deactivate a webhook
- [`webhooksGenerateOrRotateSharedSecret`](docs/sdks/webhooks/README.md#generateorrotatesharedsecret) - Generate or rotate a shared secret
- [`webhooksGet`](docs/sdks/webhooks/README.md#get) - Get a webhook by ID
- [`webhooksGetSharedSecret`](docs/sdks/webhooks/README.md#getsharedsecret) - Get a shared secret
- [`webhooksHealthCheck`](docs/sdks/webhooks/README.md#healthcheck) - Get the health of the service
- [`webhooksList`](docs/sdks/webhooks/README.md#list) - List webhooks
- [`webhooksUpdate`](docs/sdks/webhooks/README.md#update) - Update a webhook

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start Pagination [pagination] -->

## Pagination

Some of the endpoints in this SDK support pagination. To use pagination, you
make your SDK calls as usual, but the returned response object will also be an
async iterable that can be consumed using the 
syntax.

Here's an example of one such pagination call:

```typescript
import { Avalanche } from "@avalanche-sdk/webhooks";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.webhooks.list({
    status: "active",
  });

  for await (const page of result) {
    // Handle the page
    console.log(page);
  }
}

run();

```

<!-- End Pagination [pagination] -->

<!-- Start Retries [retries] -->

## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:

```typescript
import { Avalanche } from "@avalanche-sdk/webhooks";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.webhooks.healthCheck({
    retries: {
      strategy: "backoff",
      backoff: {
        initialInterval: 1,
        maxInterval: 50,
        exponent: 1.1,
        maxElapsedTime: 100,
      },
      retryConnectionErrors: false,
    },
  });

  // Handle the result
  console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:

```typescript
import { Avalanche } from "@avalanche-sdk/webhooks";

const avalanche = new Avalanche({
  retryConfig: {
    strategy: "backoff",
    backoff: {
      initialInterval: 1,
      maxInterval: 50,
      exponent: 1.1,
      maxElapsedTime: 100,
    },
    retryConnectionErrors: false,
  },
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.webhooks.healthCheck();

  // Handle the result
  console.log(result);
}

run();

```

<!-- End Retries [retries] -->

<!-- Start Error Handling [errors] -->

## Error Handling

Some methods specify known errors which can be thrown. All the known errors are enumerated in the `models/errors/errors.ts` module. The known errors for a method are documented under the *Errors* tables in SDK docs. For example, the `healthCheck` method may throw the following errors:

| Error Type                     | Status Code | Content Type     |
| ------------------------------ | ----------- | ---------------- |
| errors.BadRequestError         | 400         | application/json |
| errors.UnauthorizedError       | 401         | application/json |
| errors.ForbiddenError          | 403         | application/json |
| errors.NotFoundError           | 404         | application/json |
| errors.TooManyRequestsError    | 429         | application/json |
| errors.InternalServerError     | 500         | application/json |
| errors.BadGatewayError         | 502         | application/json |
| errors.ServiceUnavailableError | 503         | application/json |
| errors.AvalancheAPIError       | 4XX, 5XX    | \*/\*            |

If the method throws an error and it is not captured by the known errors, it will default to throwing a `AvalancheAPIError`.

```typescript
import { Avalanche } from "@avalanche-sdk/webhooks";
import {
  BadGatewayError,
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  SDKValidationError,
  ServiceUnavailableError,
  TooManyRequestsError,
  UnauthorizedError,
} from "@avalanche-sdk/webhooks/models/errors";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  let result;
  try {
    result = await avalanche.webhooks.healthCheck();

    // Handle the result
    console.log(result);
  } catch (err) {
    switch (true) {
      // The server response does not match the expected SDK schema
      case (err instanceof SDKValidationError): {
        // Pretty-print will provide a human-readable multi-line error message
        console.error(err.pretty());
        // Raw value may also be inspected
        console.error(err.rawValue);
        return;
      }
      case (err instanceof BadRequestError): {
        // Handle err.data$: BadRequestErrorData
        console.error(err);
        return;
      }
      case (err instanceof UnauthorizedError): {
        // Handle err.data$: UnauthorizedErrorData
        console.error(err);
        return;
      }
      case (err instanceof ForbiddenError): {
        // Handle err.data$: ForbiddenErrorData
        console.error(err);
        return;
      }
      case (err instanceof NotFoundError): {
        // Handle err.data$: NotFoundErrorData
        console.error(err);
        return;
      }
      case (err instanceof TooManyRequestsError): {
        // Handle err.data$: TooManyRequestsErrorData
        console.error(err);
        return;
      }
      case (err instanceof InternalServerError): {
        // Handle err.data$: InternalServerErrorData
        console.error(err);
        return;
      }
      case (err instanceof BadGatewayError): {
        // Handle err.data$: BadGatewayErrorData
        console.error(err);
        return;
      }
      case (err instanceof ServiceUnavailableError): {
        // Handle err.data$: ServiceUnavailableErrorData
        console.error(err);
        return;
      }
      default: {
        // Other errors such as network errors, see HTTPClientErrors for more details
        throw err;
      }
    }
  }
}

run();

```

Validation errors can also occur when either method arguments or data returned from the server do not match the expected format. The `SDKValidationError` that is thrown as a result will capture the raw value that failed validation in an attribute called `rawValue`. Additionally, a `pretty()` method is available on this error that can be used to log a nicely formatted multi-line string since validation errors can list many issues and the plain error string may be difficult read when debugging.

In some rare cases, the SDK can fail to get a response from the server or even make the request due to unexpected circumstances such as network conditions. These types of errors are captured in the `models/errors/httpclienterrors.ts` module:

| HTTP Client Error     | Description                                          |
| --------------------- | ---------------------------------------------------- |
| RequestAbortedError   | HTTP request was aborted by the client               |
| RequestTimeoutError   | HTTP request timed out due to an AbortSignal signal  |
| ConnectionError       | HTTP client was unable to make a request to a server |
| InvalidRequestError   | Any input used to create a request is invalid        |
| UnexpectedClientError | Unrecognised or unexpected error                     |

<!-- End Error Handling [errors] -->

<!-- Start Server Selection [server] -->

## Server Selection

### Override Server URL Per-Client

The default server can be overridden globally by passing a URL to the `serverURL: string` optional parameter when initializing the SDK client instance. For example:

```typescript
import { Avalanche } from "@avalanche-sdk/webhooks";

const avalanche = new Avalanche({
  serverURL: "https://glacier-api.avax.network",
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.webhooks.healthCheck();

  // Handle the result
  console.log(result);
}

run();

```

<!-- End Server Selection [server] -->

<!-- Start Custom HTTP Client [http-client] -->

## Custom HTTP Client

The TypeScript SDK makes API calls using an `HTTPClient` that wraps the native
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This
client is a thin wrapper around `fetch` and provides the ability to attach hooks
around the request lifecycle that can be used to modify the request or handle
errors and response.

The `HTTPClient` constructor takes an optional `fetcher` argument that can be
used to integrate a third-party HTTP client or when writing tests to mock out
the HTTP client and feed in fixtures.

The following example shows how to use the `"beforeRequest"` hook to to add a
custom header and a timeout to requests and how to use the `"requestError"` hook
to log errors:

```typescript
import { Avalanche } from "@avalanche-sdk/webhooks";
import { HTTPClient } from "@avalanche-sdk/webhooks/lib/http";

const httpClient = new HTTPClient({
  // fetcher takes a function that has the same signature as native `fetch`.
  fetcher: (request) => {
    return fetch(request);
  }
});

httpClient.addHook("beforeRequest", (request) => {
  const nextRequest = new Request(request, {
    signal: request.signal || AbortSignal.timeout(5000)
  });

  nextRequest.headers.set("x-custom-header", "custom value");

  return nextRequest;
});

httpClient.addHook("requestError", (error, request) => {
  console.group("Request Error");
  console.log("Reason:", `${error}`);
  console.log("Endpoint:", `${request.method} ${request.url}`);
  console.groupEnd();
});

const sdk = new Avalanche({ httpClient });
```

<!-- End Custom HTTP Client [http-client] -->

<!-- Start Debugging [debug] -->

## Debugging

You can setup your SDK to emit debug logs for SDK requests and responses.

You can pass a logger that matches `console`'s interface as an SDK option.

> [!WARNING]
> Beware that debug logging will reveal secrets, like API tokens in headers, in log messages printed to a console or files. It's recommended to use this feature only during local development and not in production.

```typescript
import { Avalanche } from "@avalanche-sdk/webhooks";

const sdk = new Avalanche({ debugLogger: console });
```

<!-- End Debugging [debug] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->

# Development

## Maturity

This SDK is in beta, and there may be breaking changes between versions without a major version update. Therefore, we recommend pinning usage
to a specific package version. This way, you can install the same version each time without breaking changes unless you are intentionally
looking for the latest version.

## Contributions

While we value open-source contributions to this SDK, this library is generated programmatically. Any manual changes added to internal files will be overwritten on the next generation.
We look forward to hearing your feedback. Feel free to open a PR or an issue with a proof of concept and we'll do our best to include it in a future release.

[for-await-of]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
