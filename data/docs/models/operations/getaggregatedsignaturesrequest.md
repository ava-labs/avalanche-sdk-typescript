# GetAggregatedSignaturesRequest

## Example Usage

```typescript
import { GetAggregatedSignaturesRequest } from "@avalanche-sdk/data/models/operations";

let value: GetAggregatedSignaturesRequest = {
  txHash: "3P91K6nuDFvDodcRuJTsgdf9SvYe5pMiKk38HppsoeAiEztCP",
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    | Example                                                                        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `network`                                                                      | [components.GlobalParamNetwork](../../models/components/globalparamnetwork.md) | :heavy_minus_sign:                                                             | Either mainnet or testnet/fuji.                                                | mainnet                                                                        |
| `txHash`                                                                       | *string*                                                                       | :heavy_check_mark:                                                             | A primary network (P or X chain) transaction hash.                             | 3P91K6nuDFvDodcRuJTsgdf9SvYe5pMiKk38HppsoeAiEztCP                              |