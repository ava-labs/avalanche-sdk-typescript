# ValidatorActivitySubEvents

## Example Usage

```typescript
import { ValidatorActivitySubEvents } from "@avalanche-sdk/chainkit/models/components";

let value: ValidatorActivitySubEvents = {
  validatorActivitySubEvents: [],
};
```

## Fields

| Field                                                                                          | Type                                                                                           | Required                                                                                       | Description                                                                                    |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `validatorActivitySubEvents`                                                                   | [components.ValidatorActivitySubEvent](../../models/components/validatoractivitysubevent.md)[] | :heavy_check_mark:                                                                             | Array of validator activity sub-event types                                                    |