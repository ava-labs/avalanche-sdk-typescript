# GetSubnetByIdRequest

## Example Usage

```typescript
import { GetSubnetByIdRequest } from "@avalanche-sdk/devtools/models/operations";

let value: GetSubnetByIdRequest = {
  network: "mainnet",
  subnetId: "11111111111111111111111111111111LpoYY",
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    | Example                                                                        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `network`                                                                      | [components.GlobalParamNetwork](../../models/components/globalparamnetwork.md) | :heavy_minus_sign:                                                             | Either mainnet or testnet/fuji.                                                | mainnet                                                                        |
| `subnetId`                                                                     | *string*                                                                       | :heavy_check_mark:                                                             | Subnet ID to fetch details for                                                 | 11111111111111111111111111111111LpoYY                                          |