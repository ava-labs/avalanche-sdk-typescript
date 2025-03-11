# Queries


## Supported Types

### `components.AllTimeNativeBalanceQueryDto`

```typescript
const value: components.AllTimeNativeBalanceQueryDto = {
  id: "<id>",
  type: "AllTimeNativeBalance",
  params: {
    firstDate: "<value>",
    lastDate: "<value>",
    minBalance: "<value>",
    evmChainId: "<id>",
  },
};
```

### `components.AnyTimeNativeBalanceQueryDto`

```typescript
const value: components.AnyTimeNativeBalanceQueryDto = {
  id: "<id>",
  type: "AnyTimeNativeBalance",
  params: {
    firstDate: "<value>",
    lastDate: "<value>",
    minBalance: "<value>",
    evmChainId: "<id>",
  },
};
```

### `components.AllTimeErc20BalanceQueryDto`

```typescript
const value: components.AllTimeErc20BalanceQueryDto = {
  id: "<id>",
  type: "AllTimeErc20Balance",
  params: {
    firstDate: "<value>",
    lastDate: "<value>",
    minBalance: "<value>",
    evmChainId: "<id>",
    contractAddress: "<value>",
  },
};
```

### `components.AnyTimeErc20BalanceQueryDto`

```typescript
const value: components.AnyTimeErc20BalanceQueryDto = {
  id: "<id>",
  type: "AnyTimeErc20Balance",
  params: {
    firstDate: "<value>",
    lastDate: "<value>",
    minBalance: "<value>",
    evmChainId: "<id>",
    contractAddress: "<value>",
  },
};
```

### `components.AllTimeNftHoldersQueryDto`

```typescript
const value: components.AllTimeNftHoldersQueryDto = {
  id: "<id>",
  type: "AllTimeNftHolders",
  params: {
    firstDate: "<value>",
    lastDate: "<value>",
    evmChainId: "<id>",
    contractAddress: "<value>",
  },
};
```

### `components.AnyTimeNftHoldersQueryDto`

```typescript
const value: components.AnyTimeNftHoldersQueryDto = {
  id: "<id>",
  type: "AnyTimeNftHolders",
  params: {
    evmChainId: "<id>",
    contractAddress: "<value>",
    startTs: 7805.29,
    endTs: 1182.74,
  },
};
```

### `components.LatestBalanceQueryDto`

```typescript
const value: components.LatestBalanceQueryDto = {
  id: "<id>",
  type: "LatestBalance",
  params: {
    minBalance: "<value>",
    evmChainId: "<id>",
    tokenType: "NATIVE",
  },
};
```

### `components.AllTimeStarsArenaBalanceQueryDto`

```typescript
const value: components.AllTimeStarsArenaBalanceQueryDto = {
  id: "<id>",
  type: "AllTimeStarsArenaBalance",
  params: {
    firstDate: "<value>",
    lastDate: "<value>",
    minBalance: "<value>",
    subjectAddress: "<value>",
  },
};
```

### `components.AnyTimeStarsArenaBalanceQueryDto`

```typescript
const value: components.AnyTimeStarsArenaBalanceQueryDto = {
  id: "<id>",
  type: "AnyTimeStarsArenaBalance",
  params: {
    firstDate: "<value>",
    lastDate: "<value>",
    minBalance: "<value>",
    subjectAddress: "<value>",
  },
};
```

### `components.LatestStarsArenaBalanceQueryDto`

```typescript
const value: components.LatestStarsArenaBalanceQueryDto = {
  id: "<id>",
  type: "LatestBalanceStarsArena",
  params: {
    minBalance: "<value>",
    subjectAddress: "<value>",
  },
};
```

