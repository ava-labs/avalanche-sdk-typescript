<div align="center">
    <h1> @avalanche-sdk/data </h1>
        <p>
            The Avalanche Data SDK is a powerful and flexible toolset designed to simplify the integration with AvaCloud's suite of blockchain services.
        </p>
        <p> 
            Currently, this SDK is focused on providing robust support for Data APIs.          
        </p>
        <a href="https://developers.avacloud.io/data-api/overview">
            <img src="https://img.shields.io/static/v1?label=Docs&message=API Ref&color=3b6ef9&style=for-the-badge" />
        </a>

</div>
<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
* [@avalanche-sdk/data](#avalanche-sdkdata)
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

> Node.js v20 or greater is required to run the MCP server.

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

Go to `Cursor Settings > Features > MCP Servers > Add new MCP server` and use the following settings:

- Name: Avalanche
- Type: `command`
- Command:
```sh
npx -y --package @avalanche-sdk/data -- mcp start --api-key ... --chain-id ... --network ... 
```

</details>

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
  const result = await avalanche.data.healthCheck.dataHealthCheck();

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

| Name     | Type   | Scheme  |
| -------- | ------ | ------- |
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
  const result = await avalanche.data.healthCheck.dataHealthCheck();

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


#### [data.evm](docs/sdks/evm/README.md)


#### [data.evm.balances](docs/sdks/evmbalances/README.md)

* [getNativeBalance](docs/sdks/evmbalances/README.md#getnativebalance) - Get native token balance
* [listErc20Balances](docs/sdks/evmbalances/README.md#listerc20balances) - List ERC-20 balances
* [listErc721Balances](docs/sdks/evmbalances/README.md#listerc721balances) - List ERC-721 balances
* [listErc1155Balances](docs/sdks/evmbalances/README.md#listerc1155balances) - List ERC-1155 balances
* [listCollectibleBalances](docs/sdks/evmbalances/README.md#listcollectiblebalances) - List collectible (ERC-721/ERC-1155) balances

#### [data.evm.blocks](docs/sdks/evmblocks/README.md)

* [listLatestBlocksAllChains](docs/sdks/evmblocks/README.md#listlatestblocksallchains) - List latest blocks across all supported EVM chains
* [getLatestBlocks](docs/sdks/evmblocks/README.md#getlatestblocks) - List latest blocks
* [getBlock](docs/sdks/evmblocks/README.md#getblock) - Get block

#### [data.evm.chains](docs/sdks/chains/README.md)

* [listAddressChains](docs/sdks/chains/README.md#listaddresschains) - List all chains associated with a given address
* [supportedChains](docs/sdks/chains/README.md#supportedchains) - List chains
* [getChainInfo](docs/sdks/chains/README.md#getchaininfo) - Get chain information
* [~~getAddressChains~~](docs/sdks/chains/README.md#getaddresschains) - **[Deprecated]** Gets a list of all chains where the address was either a sender or receiver in a transaction or ERC transfer. The list is currently updated every 15 minutes.

⚠️ **This operation will be removed in a future release.  Please use /v1/address/:address/chains endpoint instead** . :warning: **Deprecated**
* [~~listAllLatestTransactions~~](docs/sdks/chains/README.md#listalllatesttransactions) - **[Deprecated]** Lists the latest transactions for all supported EVM chains. Filterable by status.

⚠️ **This operation will be removed in a future release.  Please use /v1/transactions endpoint instead** . :warning: **Deprecated**
* [~~listAllLatestBlocks~~](docs/sdks/chains/README.md#listalllatestblocks) - **[Deprecated]** Lists the latest blocks for all supported EVM chains. Filterable by network.

⚠️ **This operation will be removed in a future release.  Please use /v1/blocks endpoint instead** . :warning: **Deprecated**

#### [data.evm.contracts](docs/sdks/contracts/README.md)

* [getContractMetadata](docs/sdks/contracts/README.md#getcontractmetadata) - Get contract metadata

#### [data.evm.transactions](docs/sdks/evmtransactions/README.md)

* [listLatestTransactionsAllChains](docs/sdks/evmtransactions/README.md#listlatesttransactionsallchains) - List the latest transactions across all supported EVM chains
* [getDeploymentTransaction](docs/sdks/evmtransactions/README.md#getdeploymenttransaction) - Get deployment transaction
* [listContractDeployments](docs/sdks/evmtransactions/README.md#listcontractdeployments) - List deployed contracts
* [listTransfers](docs/sdks/evmtransactions/README.md#listtransfers) - List ERC transfers
* [listTransactions](docs/sdks/evmtransactions/README.md#listtransactions) - List transactions
* [listNativeTransactions](docs/sdks/evmtransactions/README.md#listnativetransactions) - List native transactions
* [listErc20Transactions](docs/sdks/evmtransactions/README.md#listerc20transactions) - List ERC-20 transfers
* [listErc721Transactions](docs/sdks/evmtransactions/README.md#listerc721transactions) - List ERC-721 transfers
* [listErc1155Transactions](docs/sdks/evmtransactions/README.md#listerc1155transactions) - List ERC-1155 transfers
* [listInternalTransactions](docs/sdks/evmtransactions/README.md#listinternaltransactions) - List internal transactions
* [getTransaction](docs/sdks/evmtransactions/README.md#gettransaction) - Get transaction
* [getTransactionsForBlock](docs/sdks/evmtransactions/README.md#gettransactionsforblock) - List transactions for a block
* [listLatestTransactions](docs/sdks/evmtransactions/README.md#listlatesttransactions) - List latest transactions

#### [data.healthCheck](docs/sdks/healthcheck/README.md)

* [dataHealthCheck](docs/sdks/healthcheck/README.md#datahealthcheck) - Get the health of the service

#### [data.icm](docs/sdks/icm/README.md)

* [getIcmMessage](docs/sdks/icm/README.md#geticmmessage) - Get an ICM message
* [listIcmMessages](docs/sdks/icm/README.md#listicmmessages) - List ICM messages
* [listIcmMessagesByAddress](docs/sdks/icm/README.md#listicmmessagesbyaddress) - List ICM messages by address

#### [data.nfts](docs/sdks/nfts/README.md)

* [reindexNft](docs/sdks/nfts/README.md#reindexnft) - Reindex NFT metadata
* [listTokens](docs/sdks/nfts/README.md#listtokens) - List tokens
* [getTokenDetails](docs/sdks/nfts/README.md#gettokendetails) - Get token details

#### [data.operations](docs/sdks/operations/README.md)

* [getOperationResult](docs/sdks/operations/README.md#getoperationresult) - Get operation
* [postTransactionExportJob](docs/sdks/operations/README.md#posttransactionexportjob) - Create transaction export operation

#### [data.primaryNetwork](docs/sdks/primarynetwork/README.md)

* [getAssetDetails](docs/sdks/primarynetwork/README.md#getassetdetails) - Get asset details
* [getChainIdsForAddresses](docs/sdks/primarynetwork/README.md#getchainidsforaddresses) - Get chain interactions for addresses
* [getNetworkDetails](docs/sdks/primarynetwork/README.md#getnetworkdetails) - Get network details
* [listBlockchains](docs/sdks/primarynetwork/README.md#listblockchains) - List blockchains
* [listSubnets](docs/sdks/primarynetwork/README.md#listsubnets) - List subnets
* [getSubnetById](docs/sdks/primarynetwork/README.md#getsubnetbyid) - Get Subnet details by ID
* [listValidators](docs/sdks/primarynetwork/README.md#listvalidators) - List validators
* [getSingleValidatorDetails](docs/sdks/primarynetwork/README.md#getsinglevalidatordetails) - Get single validator details
* [listDelegators](docs/sdks/primarynetwork/README.md#listdelegators) - List delegators
* [listL1Validators](docs/sdks/primarynetwork/README.md#listl1validators) - List L1 validators

#### [data.primaryNetwork.balances](docs/sdks/primarynetworkbalances/README.md)

* [getBalancesByAddresses](docs/sdks/primarynetworkbalances/README.md#getbalancesbyaddresses) - Get balances

#### [data.primaryNetwork.blocks](docs/sdks/primarynetworkblocks/README.md)

* [getBlockById](docs/sdks/primarynetworkblocks/README.md#getblockbyid) - Get block
* [listPrimaryNetworkBlocksByNodeId](docs/sdks/primarynetworkblocks/README.md#listprimarynetworkblocksbynodeid) - List blocks proposed by node
* [listLatestPrimaryNetworkBlocks](docs/sdks/primarynetworkblocks/README.md#listlatestprimarynetworkblocks) - List latest blocks

#### [data.primaryNetwork.rewards](docs/sdks/rewards/README.md)

* [listPendingPrimaryNetworkRewards](docs/sdks/rewards/README.md#listpendingprimarynetworkrewards) - List pending rewards
* [listHistoricalPrimaryNetworkRewards](docs/sdks/rewards/README.md#listhistoricalprimarynetworkrewards) - List historical rewards

#### [data.primaryNetwork.transactions](docs/sdks/primarynetworktransactions/README.md)

* [getTxByHash](docs/sdks/primarynetworktransactions/README.md#gettxbyhash) - Get transaction
* [listLatestPrimaryNetworkTransactions](docs/sdks/primarynetworktransactions/README.md#listlatestprimarynetworktransactions) - List latest transactions
* [listActivePrimaryNetworkStakingTransactions](docs/sdks/primarynetworktransactions/README.md#listactiveprimarynetworkstakingtransactions) - List staking transactions
* [listAssetTransactions](docs/sdks/primarynetworktransactions/README.md#listassettransactions) - List asset transactions

#### [data.primaryNetwork.utxos](docs/sdks/utxos/README.md)

* [getUtxosByAddresses](docs/sdks/utxos/README.md#getutxosbyaddresses) - List UTXOs

#### [data.primaryNetwork.vertices](docs/sdks/vertices/README.md)

* [listLatestXChainVertices](docs/sdks/vertices/README.md#listlatestxchainvertices) - List vertices
* [getVertexByHash](docs/sdks/vertices/README.md#getvertexbyhash) - Get vertex
* [getVertexByHeight](docs/sdks/vertices/README.md#getvertexbyheight) - List vertices by height

#### [data.signatureAggregator](docs/sdks/signatureaggregator/README.md)

* [aggregateSignatures](docs/sdks/signatureaggregator/README.md#aggregatesignatures) - Aggregate Signatures

#### [~~data.teleporter~~](docs/sdks/teleporter/README.md)

* [~~getTeleporterMessage~~](docs/sdks/teleporter/README.md#getteleportermessage) - **[Deprecated]** Gets a teleporter message by message ID.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/messages/:messageId endpoint instead** . :warning: **Deprecated**
* [~~listTeleporterMessages~~](docs/sdks/teleporter/README.md#listteleportermessages) - **[Deprecated]** Lists teleporter messages. Ordered by timestamp in  descending order.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/messages endpoint instead** . :warning: **Deprecated**
* [~~listTeleporterMessagesByAddress~~](docs/sdks/teleporter/README.md#listteleportermessagesbyaddress) - **[Deprecated]** Lists teleporter messages by address. Ordered by  timestamp in descending order.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/addresses/:address/messages endpoint instead** . :warning: **Deprecated**

#### [data.usageMetrics](docs/sdks/usagemetrics/README.md)

* [getApiUsageMetrics](docs/sdks/usagemetrics/README.md#getapiusagemetrics) - Get usage metrics for the Data API
* [getApiLogs](docs/sdks/usagemetrics/README.md#getapilogs) - Get logs for requests made by client
* [getSubnetRpcUsageMetrics](docs/sdks/usagemetrics/README.md#getsubnetrpcusagemetrics) - Get usage metrics for the Subnet RPC
* [~~getRpcUsageMetrics~~](docs/sdks/usagemetrics/README.md#getrpcusagemetrics) - **[Deprecated]**  Gets metrics for public Subnet RPC usage over a specified time interval aggregated at the specified time-duration granularity.

⚠️ **This operation will be removed in a future release.  Please use /v1/subnetRpcUsageMetrics endpoint instead**. :warning: **Deprecated**

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

- [`dataEvmBalancesGetNativeBalance`](docs/sdks/evmbalances/README.md#getnativebalance) - Get native token balance
- [`dataEvmBalancesListCollectibleBalances`](docs/sdks/evmbalances/README.md#listcollectiblebalances) - List collectible (ERC-721/ERC-1155) balances
- [`dataEvmBalancesListErc1155Balances`](docs/sdks/evmbalances/README.md#listerc1155balances) - List ERC-1155 balances
- [`dataEvmBalancesListErc20Balances`](docs/sdks/evmbalances/README.md#listerc20balances) - List ERC-20 balances
- [`dataEvmBalancesListErc721Balances`](docs/sdks/evmbalances/README.md#listerc721balances) - List ERC-721 balances
- [`dataEvmBlocksGetBlock`](docs/sdks/evmblocks/README.md#getblock) - Get block
- [`dataEvmBlocksGetLatestBlocks`](docs/sdks/evmblocks/README.md#getlatestblocks) - List latest blocks
- [`dataEvmBlocksListLatestBlocksAllChains`](docs/sdks/evmblocks/README.md#listlatestblocksallchains) - List latest blocks across all supported EVM chains
- [`dataEvmChainsGetChainInfo`](docs/sdks/chains/README.md#getchaininfo) - Get chain information
- [`dataEvmChainsListAddressChains`](docs/sdks/chains/README.md#listaddresschains) - List all chains associated with a given address
- [`dataEvmChainsSupportedChains`](docs/sdks/chains/README.md#supportedchains) - List chains
- [`dataEvmContractsGetContractMetadata`](docs/sdks/contracts/README.md#getcontractmetadata) - Get contract metadata
- [`dataEvmTransactionsGetDeploymentTransaction`](docs/sdks/evmtransactions/README.md#getdeploymenttransaction) - Get deployment transaction
- [`dataEvmTransactionsGetTransaction`](docs/sdks/evmtransactions/README.md#gettransaction) - Get transaction
- [`dataEvmTransactionsGetTransactionsForBlock`](docs/sdks/evmtransactions/README.md#gettransactionsforblock) - List transactions for a block
- [`dataEvmTransactionsListContractDeployments`](docs/sdks/evmtransactions/README.md#listcontractdeployments) - List deployed contracts
- [`dataEvmTransactionsListErc1155Transactions`](docs/sdks/evmtransactions/README.md#listerc1155transactions) - List ERC-1155 transfers
- [`dataEvmTransactionsListErc20Transactions`](docs/sdks/evmtransactions/README.md#listerc20transactions) - List ERC-20 transfers
- [`dataEvmTransactionsListErc721Transactions`](docs/sdks/evmtransactions/README.md#listerc721transactions) - List ERC-721 transfers
- [`dataEvmTransactionsListInternalTransactions`](docs/sdks/evmtransactions/README.md#listinternaltransactions) - List internal transactions
- [`dataEvmTransactionsListLatestTransactions`](docs/sdks/evmtransactions/README.md#listlatesttransactions) - List latest transactions
- [`dataEvmTransactionsListLatestTransactionsAllChains`](docs/sdks/evmtransactions/README.md#listlatesttransactionsallchains) - List the latest transactions across all supported EVM chains
- [`dataEvmTransactionsListNativeTransactions`](docs/sdks/evmtransactions/README.md#listnativetransactions) - List native transactions
- [`dataEvmTransactionsListTransactions`](docs/sdks/evmtransactions/README.md#listtransactions) - List transactions
- [`dataEvmTransactionsListTransfers`](docs/sdks/evmtransactions/README.md#listtransfers) - List ERC transfers
- [`dataHealthCheckDataHealthCheck`](docs/sdks/healthcheck/README.md#datahealthcheck) - Get the health of the service
- [`dataIcmGetIcmMessage`](docs/sdks/icm/README.md#geticmmessage) - Get an ICM message
- [`dataIcmListIcmMessages`](docs/sdks/icm/README.md#listicmmessages) - List ICM messages
- [`dataIcmListIcmMessagesByAddress`](docs/sdks/icm/README.md#listicmmessagesbyaddress) - List ICM messages by address
- [`dataNftsGetTokenDetails`](docs/sdks/nfts/README.md#gettokendetails) - Get token details
- [`dataNftsListTokens`](docs/sdks/nfts/README.md#listtokens) - List tokens
- [`dataNftsReindexNft`](docs/sdks/nfts/README.md#reindexnft) - Reindex NFT metadata
- [`dataOperationsGetOperationResult`](docs/sdks/operations/README.md#getoperationresult) - Get operation
- [`dataOperationsPostTransactionExportJob`](docs/sdks/operations/README.md#posttransactionexportjob) - Create transaction export operation
- [`dataPrimaryNetworkBalancesGetBalancesByAddresses`](docs/sdks/primarynetworkbalances/README.md#getbalancesbyaddresses) - Get balances
- [`dataPrimaryNetworkBlocksGetBlockById`](docs/sdks/primarynetworkblocks/README.md#getblockbyid) - Get block
- [`dataPrimaryNetworkBlocksListLatestPrimaryNetworkBlocks`](docs/sdks/primarynetworkblocks/README.md#listlatestprimarynetworkblocks) - List latest blocks
- [`dataPrimaryNetworkBlocksListPrimaryNetworkBlocksByNodeId`](docs/sdks/primarynetworkblocks/README.md#listprimarynetworkblocksbynodeid) - List blocks proposed by node
- [`dataPrimaryNetworkGetAssetDetails`](docs/sdks/primarynetwork/README.md#getassetdetails) - Get asset details
- [`dataPrimaryNetworkGetChainIdsForAddresses`](docs/sdks/primarynetwork/README.md#getchainidsforaddresses) - Get chain interactions for addresses
- [`dataPrimaryNetworkGetNetworkDetails`](docs/sdks/primarynetwork/README.md#getnetworkdetails) - Get network details
- [`dataPrimaryNetworkGetSingleValidatorDetails`](docs/sdks/primarynetwork/README.md#getsinglevalidatordetails) - Get single validator details
- [`dataPrimaryNetworkGetSubnetById`](docs/sdks/primarynetwork/README.md#getsubnetbyid) - Get Subnet details by ID
- [`dataPrimaryNetworkListBlockchains`](docs/sdks/primarynetwork/README.md#listblockchains) - List blockchains
- [`dataPrimaryNetworkListDelegators`](docs/sdks/primarynetwork/README.md#listdelegators) - List delegators
- [`dataPrimaryNetworkListL1Validators`](docs/sdks/primarynetwork/README.md#listl1validators) - List L1 validators
- [`dataPrimaryNetworkListSubnets`](docs/sdks/primarynetwork/README.md#listsubnets) - List subnets
- [`dataPrimaryNetworkListValidators`](docs/sdks/primarynetwork/README.md#listvalidators) - List validators
- [`dataPrimaryNetworkRewardsListHistoricalPrimaryNetworkRewards`](docs/sdks/rewards/README.md#listhistoricalprimarynetworkrewards) - List historical rewards
- [`dataPrimaryNetworkRewardsListPendingPrimaryNetworkRewards`](docs/sdks/rewards/README.md#listpendingprimarynetworkrewards) - List pending rewards
- [`dataPrimaryNetworkTransactionsGetTxByHash`](docs/sdks/primarynetworktransactions/README.md#gettxbyhash) - Get transaction
- [`dataPrimaryNetworkTransactionsListActivePrimaryNetworkStakingTransactions`](docs/sdks/primarynetworktransactions/README.md#listactiveprimarynetworkstakingtransactions) - List staking transactions
- [`dataPrimaryNetworkTransactionsListAssetTransactions`](docs/sdks/primarynetworktransactions/README.md#listassettransactions) - List asset transactions
- [`dataPrimaryNetworkTransactionsListLatestPrimaryNetworkTransactions`](docs/sdks/primarynetworktransactions/README.md#listlatestprimarynetworktransactions) - List latest transactions
- [`dataPrimaryNetworkUtxosGetUtxosByAddresses`](docs/sdks/utxos/README.md#getutxosbyaddresses) - List UTXOs
- [`dataPrimaryNetworkVerticesGetVertexByHash`](docs/sdks/vertices/README.md#getvertexbyhash) - Get vertex
- [`dataPrimaryNetworkVerticesGetVertexByHeight`](docs/sdks/vertices/README.md#getvertexbyheight) - List vertices by height
- [`dataPrimaryNetworkVerticesListLatestXChainVertices`](docs/sdks/vertices/README.md#listlatestxchainvertices) - List vertices
- [`dataSignatureAggregatorAggregateSignatures`](docs/sdks/signatureaggregator/README.md#aggregatesignatures) - Aggregate Signatures
- [`dataUsageMetricsGetApiLogs`](docs/sdks/usagemetrics/README.md#getapilogs) - Get logs for requests made by client
- [`dataUsageMetricsGetApiUsageMetrics`](docs/sdks/usagemetrics/README.md#getapiusagemetrics) - Get usage metrics for the Data API
- [`dataUsageMetricsGetSubnetRpcUsageMetrics`](docs/sdks/usagemetrics/README.md#getsubnetrpcusagemetrics) - Get usage metrics for the Subnet RPC
- ~~[`dataEvmChainsGetAddressChains`](docs/sdks/chains/README.md#getaddresschains)~~ - **[Deprecated]** Gets a list of all chains where the address was either a sender or receiver in a transaction or ERC transfer. The list is currently updated every 15 minutes.

⚠️ **This operation will be removed in a future release.  Please use /v1/address/:address/chains endpoint instead** . :warning: **Deprecated**
- ~~[`dataEvmChainsListAllLatestBlocks`](docs/sdks/chains/README.md#listalllatestblocks)~~ - **[Deprecated]** Lists the latest blocks for all supported EVM chains. Filterable by network.

⚠️ **This operation will be removed in a future release.  Please use /v1/blocks endpoint instead** . :warning: **Deprecated**
- ~~[`dataEvmChainsListAllLatestTransactions`](docs/sdks/chains/README.md#listalllatesttransactions)~~ - **[Deprecated]** Lists the latest transactions for all supported EVM chains. Filterable by status.

⚠️ **This operation will be removed in a future release.  Please use /v1/transactions endpoint instead** . :warning: **Deprecated**
- ~~[`dataTeleporterGetTeleporterMessage`](docs/sdks/teleporter/README.md#getteleportermessage)~~ - **[Deprecated]** Gets a teleporter message by message ID.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/messages/:messageId endpoint instead** . :warning: **Deprecated**
- ~~[`dataTeleporterListTeleporterMessages`](docs/sdks/teleporter/README.md#listteleportermessages)~~ - **[Deprecated]** Lists teleporter messages. Ordered by timestamp in  descending order.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/messages endpoint instead** . :warning: **Deprecated**
- ~~[`dataTeleporterListTeleporterMessagesByAddress`](docs/sdks/teleporter/README.md#listteleportermessagesbyaddress)~~ - **[Deprecated]** Lists teleporter messages by address. Ordered by  timestamp in descending order.

⚠️ **This operation will be removed in a future release.  Please use /v1/icm/addresses/:address/messages endpoint instead** . :warning: **Deprecated**
- ~~[`dataUsageMetricsGetRpcUsageMetrics`](docs/sdks/usagemetrics/README.md#getrpcusagemetrics)~~ - **[Deprecated]**  Gets metrics for public Subnet RPC usage over a specified time interval aggregated at the specified time-duration granularity.

⚠️ **This operation will be removed in a future release.  Please use /v1/subnetRpcUsageMetrics endpoint instead**. :warning: **Deprecated**

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start Global Parameters [global-parameters] -->
## Global Parameters

Certain parameters are configured globally. These parameters may be set on the SDK client instance itself during initialization. When configured as an option during SDK initialization, These global values will be used as defaults on the operations that use them. When such operations are called, there is a place in each to override the global value, if needed.

For example, you can set `chainId` to `"43114"` at SDK initialization and then you do not have to pass the same value on calls to operations like `supportedChains`. But if you want to do so you may, which will locally override the global setting. See the example code below for a demonstration.


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
  const result = await avalanche.data.evm.chains.supportedChains({
    network: "mainnet",
    feature: "nftIndexing",
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
async iterable that can be consumed using the [`for await...of`][for-await-of]
syntax.

[for-await-of]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of

Here's an example of one such pagination call:

```typescript
import { Avalanche } from "@avalanche-sdk/data";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.evm.transactions
    .listLatestTransactionsAllChains({
      network: "mainnet",
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
  const result = await avalanche.data.healthCheck.dataHealthCheck({
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
  const result = await avalanche.data.healthCheck.dataHealthCheck();

  // Handle the result
  console.log(result);
}

run();

```
<!-- End Retries [retries] -->

<!-- Start Error Handling [errors] -->
## Error Handling

Some methods specify known errors which can be thrown. All the known errors are enumerated in the `models/errors/errors.ts` module. The known errors for a method are documented under the *Errors* tables in SDK docs. For example, the `reindexNft` method may throw the following errors:

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
    await avalanche.data.nfts.reindexNft({
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

| HTTP Client Error                                    | Description                                          |
| ---------------------------------------------------- | ---------------------------------------------------- |
| RequestAbortedError                                  | HTTP request was aborted by the client               |
| RequestTimeoutError                                  | HTTP request timed out due to an AbortSignal signal  |
| ConnectionError                                      | HTTP client was unable to make a request to a server |
| InvalidRequestError                                  | Any input used to create a request is invalid        |
| UnexpectedClientError                                | Unrecognised or unexpected error                     |
<!-- End Error Handling [errors] -->

<!-- Start Server Selection [server] -->
## Server Selection

### Override Server URL Per-Client

The default server can be overridden globally by passing a URL to the `serverURL: string` optional parameter when initializing the SDK client instance. For example:
```typescript
import { Avalanche } from "@avalanche-sdk/data";

const avalanche = new Avalanche({
  serverURL: "https://glacier-api.avax.network",
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.data.healthCheck.dataHealthCheck();

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