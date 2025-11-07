# AvaxSupplyResponse

## Example Usage

```typescript
import { AvaxSupplyResponse } from "@avalanche-sdk/chainkit/models/components";

let value: AvaxSupplyResponse = {
  circulatingSupply: "454257251.7149865026656081965",
  totalSupply: "454257251.7149865026656081965",
  totalPBurned: "15039.56226661934233308491042",
  totalCBurned: "4868917.656222642629429578983",
  totalXBurned: "45577.89911362119281041174838",
  totalStaked: "199605247.61112",
  totalLocked: "36162978.31786130001530843447",
  totalRewards: "99186786.83258938583018127214",
  lastUpdated: new Date("2025-11-05T20:15:15.678Z"),
  genesisUnlock: "360000000",
};
```

## Fields

| Field                                                                                         | Type                                                                                          | Required                                                                                      | Description                                                                                   | Example                                                                                       |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `circulatingSupply`                                                                           | *string*                                                                                      | :heavy_check_mark:                                                                            | The circulating supply of AVAX.                                                               | 454257251.7149865026656081965                                                                 |
| `totalSupply`                                                                                 | *string*                                                                                      | :heavy_check_mark:                                                                            | The total supply of AVAX.                                                                     | 454257251.7149865026656081965                                                                 |
| `totalPBurned`                                                                                | *string*                                                                                      | :heavy_check_mark:                                                                            | The total P-chain burned fees of AVAX.                                                        | 15039.56226661934233308491042                                                                 |
| `totalCBurned`                                                                                | *string*                                                                                      | :heavy_check_mark:                                                                            | The total C-chain burned fees of AVAX.                                                        | 4868917.656222642629429578983                                                                 |
| `totalXBurned`                                                                                | *string*                                                                                      | :heavy_check_mark:                                                                            | The total X-chain burned fees of AVAX.                                                        | 45577.89911362119281041174838                                                                 |
| `totalStaked`                                                                                 | *string*                                                                                      | :heavy_check_mark:                                                                            | The total staked AVAX.                                                                        | 199605247.61112                                                                               |
| `totalLocked`                                                                                 | *string*                                                                                      | :heavy_check_mark:                                                                            | The total locked AVAX.                                                                        | 36162978.31786130001530843447                                                                 |
| `totalRewards`                                                                                | *string*                                                                                      | :heavy_check_mark:                                                                            | The total rewards AVAX.                                                                       | 99186786.83258938583018127214                                                                 |
| `lastUpdated`                                                                                 | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | :heavy_check_mark:                                                                            | The last updated time of the AVAX supply.                                                     | 2025-11-05T20:15:15.678Z                                                                      |
| `genesisUnlock`                                                                               | *string*                                                                                      | :heavy_check_mark:                                                                            | The genesis unlock amount of the AVAX supply.                                                 | 360000000                                                                                     |