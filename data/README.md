<div align="center">
    <h1> @avalanche-sdk/data </h1>
        <p>
            The Avalanche Data SDK is a powerful and flexible toolset designed to simplify the integration with Avalanche's suite of blockchain services.
        </p>
        <p> 
            Currently, this SDK is focused on providing robust support for Data APIs.  
        </p>
        <a href="https://developers.avacloud.io/data-api/overview">
            <img src="https://img.shields.io/static/v1?label=Docs&message=API Ref&color=3b6ef9&style=for-the-badge" />
        </a>

</div>
<!-- End Summary [summary] -->


<!-- Start Summary [summary] -->

## Summary

Data API: The Data API provides web3 application developers with multi-chain data related to Avalanche's primary network, Avalanche subnets, and Ethereum. With Data API, you can easily build products that leverage real-time and historical transaction and transfer history, native and token balances, and various types of token metadata. The API is in Beta and may be subject to change.`</br></br>`If you have feedback or feature requests for the API, please submit them `<a href="https://portal.productboard.com/dndv9ahlkdfye4opdm8ksafi/tabs/4-glacier-api">`here`</a>`. Bug reports can be submitted `<a href="https://docs.google.com/forms/d/e/1FAIpQLSeJQrcp7QoNiqozMDKrVJGX5wpU827d3cVTgF8qa7t_J1Pb-g/viewform">`here`</a>`, and any potential security issues can be reported `<a href="https://immunefi.com/bounty/avalabs">`here`</a>`.

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
* [Global Parameters](#global-parameters)
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
npm add @avalanche-sdk/data
```

### PNPM

```bash
pnpm add @avalanche-sdk/data
```

### Bun

```bash
bun add @avalanche-sdk/data
```

### Yarn

```bash
yarn add @avalanche-sdk/data zod

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
        "-y", "--package", "@avalanche-sdk/data",
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
        "-y", "--package", "@avalanche-sdk/data",
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
npx -y --package @avalanche-sdk/data -- mcp start --help
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
import { Avalanche } from "@avalanche-sdk/data";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.healthCheck();

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
import { Avalanche } from "@avalanche-sdk/data";

const avalanche = new Avalanche({
  apiKey: "<YOUR_API_KEY_HERE>",
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.healthCheck();

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

### [data](docs/sdks/data/README.md)

* [healthCheck](docs/sdks/data/README.md#healthcheck) - Get the health of the service

#### [data.evm](docs/sdks/evm/README.md)

#### [data.evm.address](docs/sdks/address/README.md)

#### [data.evm.address.balances](docs/sdks/addressbalances/README.md)

* [getNative](docs/sdks/addressbalances/README.md#getnative) - Get native token balance
* [listErc20](docs/sdks/addressbalances/README.md#listerc20) - List ERC-20 balances
* [listErc721](docs/sdks/addressbalances/README.md#listerc721) - List ERC-721 balances
* [listErc1155](docs/sdks/addressbalances/README.md#listerc1155) - List ERC-1155 balances
* [listCollectibles](docs/sdks/addressbalances/README.md#listcollectibles) - List collectible (ERC-721/ERC-1155) balances

#### [data.evm.address.chains](docs/sdks/addresschains/README.md)

* [list](docs/sdks/addresschains/README.md#list) - List all chains associated with a given address

#### [data.evm.address.contracts](docs/sdks/addresscontracts/README.md)

* [listDeployments](docs/sdks/addresscontracts/README.md#listdeployments) - List deployed contracts

#### [data.evm.address.transactions](docs/sdks/addresstransactions/README.md)

* [list](docs/sdks/addresstransactions/README.md#list) - List transactions
* [listNative](docs/sdks/addresstransactions/README.md#listnative) - List native transactions
* [listErc20](docs/sdks/addresstransactions/README.md#listerc20) - List ERC-20 transfers
* [listErc721](docs/sdks/addresstransactions/README.md#listerc721) - List ERC-721 transfers
* [listErc1155](docs/sdks/addresstransactions/README.md#listerc1155) - List ERC-1155 transfers
* [listInternal](docs/sdks/addresstransactions/README.md#listinternal) - List internal transactions

#### [data.evm.blocks](docs/sdks/evmblocks/README.md)

* [listLatestAllChains](docs/sdks/evmblocks/README.md#listlatestallchains) - List latest blocks across all supported EVM chains
* [listLatest](docs/sdks/evmblocks/README.md#listlatest) - List latest blocks
* [get](docs/sdks/evmblocks/README.md#get) - Get block
* [listTransactions](docs/sdks/evmblocks/README.md#listtransactions) - List transactions for a block

#### [data.evm.chains](docs/sdks/chains/README.md)

* [list](docs/sdks/chains/README.md#list) - List chains
* [get](docs/sdks/chains/README.md#get) - Get chain information
* [~~getAddressChains~~](docs/sdks/chains/README.md#getaddresschains) - **[Deprecated]** Gets a list of all chains where the address was either a sender or receiver in a transaction or ERC transfer. The list is currently updated every 15 minutes.

⚠️ **This operation will be removed in a future release.  Please use /v1/address/:address/chains endpoint instead** . ⚠️ **Deprecated**

* [~~listAllLatestTransactions~~](docs/sdks/chains/README.md#listalllatesttransactions) - **[Deprecated]** Lists the latest transactions for all supported EVM chains. Filterable by status.

⚠️ **This operation will be removed in a future release.  Please use /v1/transactions endpoint instead** . ⚠️ **Deprecated**

* [~~listAllLatestBlocks~~](docs/sdks/chains/README.md#listalllatestblocks) - **[Deprecated]** Lists the latest blocks for all supported EVM chains. Filterable by network.

⚠️ **This operation will be removed in a future release.  Please use /v1/blocks endpoint instead** . ⚠️ **Deprecated**

#### [data.evm.contracts](docs/sdks/contracts/README.md)

* [getDeploymentTransaction](docs/sdks/contracts/README.md#getdeploymenttransaction) - Get deployment transaction
* [getMetadata](docs/sdks/contracts/README.md#getmetadata) - Get contract metadata
* [listTransfers](docs/sdks/contracts/README.md#listtransfers) - List ERC transfers

#### [data.evm.transactions](docs/sdks/evmtransactions/README.md)

* [listLatestAllChains](docs/sdks/evmtransactions/README.md#listlatestallchains) - List the latest transactions across all supported EVM chains
* [get](docs/sdks/evmtransactions/README.md#get) - Get transaction
* [listLatest](docs/sdks/evmtransactions/README.md#listlatest) - List latest transactions

#### [data.icm](docs/sdks/icm/README.md)

* [get](docs/sdks/icm/README.md#get) - Get an ICM message
* [list](docs/sdks/icm/README.md#list) - List ICM messages
* [listByAddress](docs/sdks/icm/README.md#listbyaddress) - List ICM messages by address

#### [data.nfts](docs/sdks/nfts/README.md)

* [reindex](docs/sdks/nfts/README.md#reindex) - Reindex NFT metadata
* [list](docs/sdks/nfts/README.md#list) - List tokens
* [get](docs/sdks/nfts/README.md#get) - Get token details

#### [data.operations](docs/sdks/operations/README.md)

* [getResult](docs/sdks/operations/README.md#getresult) - Get operation
* [exportTransactions](docs/sdks/operations/README.md#exporttransactions) - Create transaction export operation

#### [data.primaryNetwork](docs/sdks/primarynetwork/README.md)

* [getAssetDetails](docs/sdks/primarynetwork/README.md#getassetdetails) - Get asset details
* [getChainIdsForAddresses](docs/sdks/primarynetwork/README.md#getchainidsforaddresses) - Get chain interactions for addresses
* [getNetworkDetails](docs/sdks/primarynetwork/README.md#getnetworkdetails) - Get network details
* [listBlockchains](docs/sdks/primarynetwork/README.md#listblockchains) - List blockchains
* [getBlockchainById](docs/sdks/primarynetwork/README.md#getblockchainbyid) - Get blockchain details by ID
* [listSubnets](docs/sdks/primarynetwork/README.md#listsubnets) - List subnets
* [getSubnetById](docs/sdks/primarynetwork/README.md#getsubnetbyid) - Get Subnet details by ID
* [listValidators](docs/sdks/primarynetwork/README.md#listvalidators) - List validators
* [getValidatorDetails](docs/sdks/primarynetwork/README.md#getvalidatordetails) - Get single validator details
* [listDelegators](docs/sdks/primarynetwork/README.md#listdelegators) - List delegators
* [listL1Validators](docs/sdks/primarynetwork/README.md#listl1validators) - List L1 validators

#### [data.primaryNetwork.balances](docs/sdks/primarynetworkbalances/README.md)

* [listByAddresses](docs/sdks/primarynetworkbalances/README.md#listbyaddresses) - Get balances

#### [data.primaryNetwork.blocks](docs/sdks/primarynetworkblocks/README.md)

* [get](docs/sdks/primarynetworkblocks/README.md#get) - Get block
* [listByNodeId](docs/sdks/primarynetworkblocks/README.md#listbynodeid) - List blocks proposed by node
* [listLatest](docs/sdks/primarynetworkblocks/README.md#listlatest) - List latest blocks

#### [data.primaryNetwork.rewards](docs/sdks/rewards/README.md)

* [listPendingRewards](docs/sdks/rewards/README.md#listpendingrewards) - List pending rewards
* [listHistoricalRewards](docs/sdks/rewards/README.md#listhistoricalrewards) - List historical rewards

#### [data.primaryNetwork.transactions](docs/sdks/primarynetworktransactions/README.md)

* [get](docs/sdks/primarynetworktransactions/README.md#get) - Get transaction
* [listLatest](docs/sdks/primarynetworktransactions/README.md#listlatest) - List latest transactions
* [listActiveStakingTransactions](docs/sdks/primarynetworktransactions/README.md#listactivestakingtransactions) - List staking transactions
* [listAssetTransactions](docs/sdks/primarynetworktransactions/README.md#listassettransactions) - List asset transactions

#### [data.primaryNetwork.utxos](docs/sdks/utxos/README.md)

* [listByAddresses](docs/sdks/utxos/README.md#listbyaddresses) - List UTXOs

#### [data.primaryNetwork.vertices](docs/sdks/vertices/README.md)

* [listLatest](docs/sdks/vertices/README.md#listlatest) - List vertices
* [getByHash](docs/sdks/vertices/README.md#getbyhash) - Get vertex
* [listByHeight](docs/sdks/vertices/README.md#listbyheight) - List vertices by height

#### [data.signatureAggregator](docs/sdks/signatureaggregator/README.md)

* [aggregate](docs/sdks/signatureaggregator/README.md#aggregate) - Aggregate Signatures
* [get](docs/sdks/signatureaggregator/README.md#get) - Get Aggregated Signatures

#### [~~data.teleporter~~](docs/sdks/teleporter/README.md)

* [~~getTeleporterMessage~~](docs/sdks/teleporter/README.md#getteleportermessage) - **[Deprecated]** Gets a teleporter message by message ID.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/messages/:messageId endpoint instead** . ⚠️ **Deprecated**

* [~~listTeleporterMessages~~](docs/sdks/teleporter/README.md#listteleportermessages) - **[Deprecated]** Lists teleporter messages. Ordered by timestamp in  descending order.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/messages endpoint instead** . ⚠️ **Deprecated**

* [~~listTeleporterMessagesByAddress~~](docs/sdks/teleporter/README.md#listteleportermessagesbyaddress) - **[Deprecated]** Lists teleporter messages by address. Ordered by  timestamp in descending order.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/addresses/:address/messages endpoint instead** . ⚠️ **Deprecated**

#### [data.usageMetrics](docs/sdks/usagemetrics/README.md)

* [getUsage](docs/sdks/usagemetrics/README.md#getusage) - Get usage metrics for the Data API
* [getLogs](docs/sdks/usagemetrics/README.md#getlogs) - Get logs for requests made by client
* [getSubnetRpcUsage](docs/sdks/usagemetrics/README.md#getsubnetrpcusage) - Get usage metrics for the Subnet RPC
* [~~getRpcUsageMetrics~~](docs/sdks/usagemetrics/README.md#getrpcusagemetrics) - **[Deprecated]**  Gets metrics for public Subnet RPC usage over a specified time interval aggregated at the specified time-duration granularity.

⚠️ **This operation will be removed in a future release.  Please use /v1/subnetRpcUsageMetrics endpoint instead**. ⚠️ **Deprecated**

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

- [`dataEvmAddressBalancesGetNative`](docs/sdks/addressbalances/README.md#getnative) - Get native token balance
- [`dataEvmAddressBalancesListCollectibles`](docs/sdks/addressbalances/README.md#listcollectibles) - List collectible (ERC-721/ERC-1155) balances
- [`dataEvmAddressBalancesListErc1155`](docs/sdks/addressbalances/README.md#listerc1155) - List ERC-1155 balances
- [`dataEvmAddressBalancesListErc20`](docs/sdks/addressbalances/README.md#listerc20) - List ERC-20 balances
- [`dataEvmAddressBalancesListErc721`](docs/sdks/addressbalances/README.md#listerc721) - List ERC-721 balances
- [`dataEvmAddressChainsList`](docs/sdks/addresschains/README.md#list) - List all chains associated with a given address
- [`dataEvmAddressContractsListDeployments`](docs/sdks/addresscontracts/README.md#listdeployments) - List deployed contracts
- [`dataEvmAddressTransactionsList`](docs/sdks/addresstransactions/README.md#list) - List transactions
- [`dataEvmAddressTransactionsListErc1155`](docs/sdks/addresstransactions/README.md#listerc1155) - List ERC-1155 transfers
- [`dataEvmAddressTransactionsListErc20`](docs/sdks/addresstransactions/README.md#listerc20) - List ERC-20 transfers
- [`dataEvmAddressTransactionsListErc721`](docs/sdks/addresstransactions/README.md#listerc721) - List ERC-721 transfers
- [`dataEvmAddressTransactionsListInternal`](docs/sdks/addresstransactions/README.md#listinternal) - List internal transactions
- [`dataEvmAddressTransactionsListNative`](docs/sdks/addresstransactions/README.md#listnative) - List native transactions
- [`dataEvmBlocksGet`](docs/sdks/evmblocks/README.md#get) - Get block
- [`dataEvmBlocksListLatest`](docs/sdks/evmblocks/README.md#listlatest) - List latest blocks
- [`dataEvmBlocksListLatestAllChains`](docs/sdks/evmblocks/README.md#listlatestallchains) - List latest blocks across all supported EVM chains
- [`dataEvmBlocksListTransactions`](docs/sdks/evmblocks/README.md#listtransactions) - List transactions for a block
- [`dataEvmChainsGet`](docs/sdks/chains/README.md#get) - Get chain information
- [`dataEvmChainsList`](docs/sdks/chains/README.md#list) - List chains
- [`dataEvmContractsGetDeploymentTransaction`](docs/sdks/contracts/README.md#getdeploymenttransaction) - Get deployment transaction
- [`dataEvmContractsGetMetadata`](docs/sdks/contracts/README.md#getmetadata) - Get contract metadata
- [`dataEvmContractsListTransfers`](docs/sdks/contracts/README.md#listtransfers) - List ERC transfers
- [`dataEvmTransactionsGet`](docs/sdks/evmtransactions/README.md#get) - Get transaction
- [`dataEvmTransactionsListLatest`](docs/sdks/evmtransactions/README.md#listlatest) - List latest transactions
- [`dataEvmTransactionsListLatestAllChains`](docs/sdks/evmtransactions/README.md#listlatestallchains) - List the latest transactions across all supported EVM chains
- [`dataHealthCheck`](docs/sdks/data/README.md#healthcheck) - Get the health of the service
- [`dataIcmGet`](docs/sdks/icm/README.md#get) - Get an ICM message
- [`dataIcmList`](docs/sdks/icm/README.md#list) - List ICM messages
- [`dataIcmListByAddress`](docs/sdks/icm/README.md#listbyaddress) - List ICM messages by address
- [`dataNftsGet`](docs/sdks/nfts/README.md#get) - Get token details
- [`dataNftsList`](docs/sdks/nfts/README.md#list) - List tokens
- [`dataNftsReindex`](docs/sdks/nfts/README.md#reindex) - Reindex NFT metadata
- [`dataOperationsExportTransactions`](docs/sdks/operations/README.md#exporttransactions) - Create transaction export operation
- [`dataOperationsGetResult`](docs/sdks/operations/README.md#getresult) - Get operation
- [`dataPrimaryNetworkBalancesListByAddresses`](docs/sdks/primarynetworkbalances/README.md#listbyaddresses) - Get balances
- [`dataPrimaryNetworkBlocksGet`](docs/sdks/primarynetworkblocks/README.md#get) - Get block
- [`dataPrimaryNetworkBlocksListByNodeId`](docs/sdks/primarynetworkblocks/README.md#listbynodeid) - List blocks proposed by node
- [`dataPrimaryNetworkBlocksListLatest`](docs/sdks/primarynetworkblocks/README.md#listlatest) - List latest blocks
- [`dataPrimaryNetworkGetAssetDetails`](docs/sdks/primarynetwork/README.md#getassetdetails) - Get asset details
- [`dataPrimaryNetworkGetBlockchainById`](docs/sdks/primarynetwork/README.md#getblockchainbyid) - Get blockchain details by ID
- [`dataPrimaryNetworkGetChainIdsForAddresses`](docs/sdks/primarynetwork/README.md#getchainidsforaddresses) - Get chain interactions for addresses
- [`dataPrimaryNetworkGetNetworkDetails`](docs/sdks/primarynetwork/README.md#getnetworkdetails) - Get network details
- [`dataPrimaryNetworkGetSubnetById`](docs/sdks/primarynetwork/README.md#getsubnetbyid) - Get Subnet details by ID
- [`dataPrimaryNetworkGetValidatorDetails`](docs/sdks/primarynetwork/README.md#getvalidatordetails) - Get single validator details
- [`dataPrimaryNetworkListBlockchains`](docs/sdks/primarynetwork/README.md#listblockchains) - List blockchains
- [`dataPrimaryNetworkListDelegators`](docs/sdks/primarynetwork/README.md#listdelegators) - List delegators
- [`dataPrimaryNetworkListL1Validators`](docs/sdks/primarynetwork/README.md#listl1validators) - List L1 validators
- [`dataPrimaryNetworkListSubnets`](docs/sdks/primarynetwork/README.md#listsubnets) - List subnets
- [`dataPrimaryNetworkListValidators`](docs/sdks/primarynetwork/README.md#listvalidators) - List validators
- [`dataPrimaryNetworkRewardsListHistoricalRewards`](docs/sdks/rewards/README.md#listhistoricalrewards) - List historical rewards
- [`dataPrimaryNetworkRewardsListPendingRewards`](docs/sdks/rewards/README.md#listpendingrewards) - List pending rewards
- [`dataPrimaryNetworkTransactionsGet`](docs/sdks/primarynetworktransactions/README.md#get) - Get transaction
- [`dataPrimaryNetworkTransactionsListActiveStakingTransactions`](docs/sdks/primarynetworktransactions/README.md#listactivestakingtransactions) - List staking transactions
- [`dataPrimaryNetworkTransactionsListAssetTransactions`](docs/sdks/primarynetworktransactions/README.md#listassettransactions) - List asset transactions
- [`dataPrimaryNetworkTransactionsListLatest`](docs/sdks/primarynetworktransactions/README.md#listlatest) - List latest transactions
- [`dataPrimaryNetworkUtxosListByAddresses`](docs/sdks/utxos/README.md#listbyaddresses) - List UTXOs
- [`dataPrimaryNetworkVerticesGetByHash`](docs/sdks/vertices/README.md#getbyhash) - Get vertex
- [`dataPrimaryNetworkVerticesListByHeight`](docs/sdks/vertices/README.md#listbyheight) - List vertices by height
- [`dataPrimaryNetworkVerticesListLatest`](docs/sdks/vertices/README.md#listlatest) - List vertices
- [`dataSignatureAggregatorAggregate`](docs/sdks/signatureaggregator/README.md#aggregate) - Aggregate Signatures
- [`dataSignatureAggregatorGet`](docs/sdks/signatureaggregator/README.md#get) - Get Aggregated Signatures
- [`dataUsageMetricsGetLogs`](docs/sdks/usagemetrics/README.md#getlogs) - Get logs for requests made by client
- [`dataUsageMetricsGetSubnetRpcUsage`](docs/sdks/usagemetrics/README.md#getsubnetrpcusage) - Get usage metrics for the Subnet RPC
- [`dataUsageMetricsGetUsage`](docs/sdks/usagemetrics/README.md#getusage) - Get usage metrics for the Data API
- ~~[`dataEvmChainsGetAddressChains`](docs/sdks/chains/README.md#getaddresschains)~~ - **[Deprecated]** Gets a list of all chains where the address was either a sender or receiver in a transaction or ERC transfer. The list is currently updated every 15 minutes.

⚠️ **This operation will be removed in a future release.  Please use /v1/address/:address/chains endpoint instead** . ⚠️ **Deprecated**

- ~~[`dataEvmChainsListAllLatestBlocks`](docs/sdks/chains/README.md#listalllatestblocks)~~ - **[Deprecated]** Lists the latest blocks for all supported EVM chains. Filterable by network.

⚠️ **This operation will be removed in a future release.  Please use /v1/blocks endpoint instead** . ⚠️ **Deprecated**

- ~~[`dataEvmChainsListAllLatestTransactions`](docs/sdks/chains/README.md#listalllatesttransactions)~~ - **[Deprecated]** Lists the latest transactions for all supported EVM chains. Filterable by status.

⚠️ **This operation will be removed in a future release.  Please use /v1/transactions endpoint instead** . ⚠️ **Deprecated**

- ~~[`dataTeleporterGetTeleporterMessage`](docs/sdks/teleporter/README.md#getteleportermessage)~~ - **[Deprecated]** Gets a teleporter message by message ID.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/messages/:messageId endpoint instead** . ⚠️ **Deprecated**

- ~~[`dataTeleporterListTeleporterMessages`](docs/sdks/teleporter/README.md#listteleportermessages)~~ - **[Deprecated]** Lists teleporter messages. Ordered by timestamp in  descending order.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/messages endpoint instead** . ⚠️ **Deprecated**

- ~~[`dataTeleporterListTeleporterMessagesByAddress`](docs/sdks/teleporter/README.md#listteleportermessagesbyaddress)~~ - **[Deprecated]** Lists teleporter messages by address. Ordered by  timestamp in descending order.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/addresses/:address/messages endpoint instead** . ⚠️ **Deprecated**

- ~~[`dataUsageMetricsGetRpcUsageMetrics`](docs/sdks/usagemetrics/README.md#getrpcusagemetrics)~~ - **[Deprecated]**  Gets metrics for public Subnet RPC usage over a specified time interval aggregated at the specified time-duration granularity.

⚠️ **This operation will be removed in a future release.  Please use /v1/subnetRpcUsageMetrics endpoint instead**. ⚠️ **Deprecated**

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start Global Parameters [global-parameters] -->

## Global Parameters

Certain parameters are configured globally. These parameters may be set on the SDK client instance itself during initialization. When configured as an option during SDK initialization, These global values will be used as defaults on the operations that use them. When such operations are called, there is a place in each to override the global value, if needed.

For example, you can set `chainId` to `"43114"` at SDK initialization and then you do not have to pass the same value on calls to operations like `getNative`. But if you want to do so you may, which will locally override the global setting. See the example code below for a demonstration.

### Available Globals

The following global parameters are available.

| Name    | Type                          | Description                                              |
| ------- | ----------------------------- | -------------------------------------------------------- |
| chainId | string                        | A supported EVM chain id, chain alias, or blockchain id. |
| network | components.GlobalParamNetwork | A supported network type mainnet or testnet/fuji.        |

### Example

```typescript
import { Avalanche } from "@avalanche-sdk/data";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.evm.address.balances.getNative({
    blockNumber: "6479329",
    chainId: "43114",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    currency: "usd",
  });

  // Handle the result
  console.log(result);
}

run();

```

<!-- End Global Parameters [global-parameters] -->

<!-- Start Pagination [pagination] -->

## Pagination

Some of the endpoints in this SDK support pagination. To use pagination, you
make your SDK calls as usual, but the returned response object will also be an
async iterable that can be consumed using the 
syntax.

Here's an example of one such pagination call:

```typescript
import { Avalanche } from "@avalanche-sdk/data";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.evm.address.balances.listErc20({
    blockNumber: "6479329",
    chainId: "43114",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    contractAddresses:
      "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7, 0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    currency: "usd",
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
import { Avalanche } from "@avalanche-sdk/data";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.healthCheck({
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
import { Avalanche } from "@avalanche-sdk/data";

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
  const result = await avalanche.data.healthCheck();

  // Handle the result
  console.log(result);
}

run();

```

<!-- End Retries [retries] -->

<!-- Start Error Handling [errors] -->

## Error Handling

Some methods specify known errors which can be thrown. All the known errors are enumerated in the `models/errors/errors.ts` module. The known errors for a method are documented under the *Errors* tables in SDK docs. For example, the `reindex` method may throw the following errors:

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
import { Avalanche } from "@avalanche-sdk/data";
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
} from "@avalanche-sdk/data/models/errors";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  try {
    await avalanche.data.nfts.reindex({
      chainId: "43114",
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      tokenId: "145",
    });
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
import { Avalanche } from "@avalanche-sdk/data";

const avalanche = new Avalanche({
  serverURL: "https://glacier-api-dev.avax.network",
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.healthCheck();

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
import { Avalanche } from "@avalanche-sdk/data";
import { HTTPClient } from "@avalanche-sdk/data/lib/http";

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
import { Avalanche } from "@avalanche-sdk/data";

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
