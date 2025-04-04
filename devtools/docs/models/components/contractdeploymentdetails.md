# ContractDeploymentDetails

## Example Usage

```typescript
import { ContractDeploymentDetails } from "@avalanche-sdk/devtools/models/components";

let value: ContractDeploymentDetails = {
  txHash: "<value>",
  deployerAddress: "<value>",
};
```

## Fields

| Field                                                                                                                                                                  | Type                                                                                                                                                                   | Required                                                                                                                                                               | Description                                                                                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `txHash`                                                                                                                                                               | *string*                                                                                                                                                               | :heavy_check_mark:                                                                                                                                                     | N/A                                                                                                                                                                    |
| `deployerAddress`                                                                                                                                                      | *string*                                                                                                                                                               | :heavy_check_mark:                                                                                                                                                     | The address that initiated the transaction which deployed this contract.                                                                                               |
| `deployerContractAddress`                                                                                                                                              | *string*                                                                                                                                                               | :heavy_minus_sign:                                                                                                                                                     | The contract address which deployed this contract via smart contract. This field is only populated when the contract was deployed as part of smart contract execution. |