# v.0.6.1 (2020-10-23)

## Add:

- [memo] Optional `address` parameter for `getDepositMemo` (needed for cross-chain deposits)

# v.0.6.0 (2020-10-23)

## Add:

- [memo] Add `memo` helpers: `getDepositMemo`, `getSwapMemo`, `getWithdrawMemo` (incl. tests)

## Fix:

- [calc] Fix circular dependencies
  ```
  src/index.ts -> src/calc/index.ts -> src/calc/swap.ts -> src/index.ts
  src/index.ts -> src/calc/index.ts -> src/calc/stake.ts -> src/index.ts
  ```

# v.0.5.0 (2020-10-06)

## Add:

- [asset] Add `currencySymbolByAsset` helper
- [string] Add trimZeros helper (incl. tests)

## Breaking changes:

- [asset] Remove `EMPTY_ASSET` and all depending helper functions
- [asset] Remove `AssetTicker` enum
- [asset] Rename AssetSymbol -> AssetCurrencySymbol
- [chain] Remove EmptyChain and all depending helper functions
- [asset] Parameter of `formatAssetAmount` is an object now:

```
{
  amount: AssetAmount
  decimal?: number
  trimZeros?: boolean
}
```

- [asset] PParameter of `formatAssetAmount` is an object now:

```
{
  amount: BaseAmount
  decimal?: number
  trimZeros?: boolean
}
```

- [asset] PParameter of `formatAssetAmountCurrency` is an object now:

```
{
  amount: AssetAmount
  asset?: Asset
  decimal?: number
  trimZeros?: boolean
}
```

# v.0.4.2 (2020-09-22)

- [calc] Add `getDoubleSwapOutputWithFee` method to calculate double swap minus transaction fee
- [chain] Add definitions for chains and helpers `isChain`, `chainToString`
- [asset] Add `AssetBNB`, `AssetBTC`, `AssetETH`, `AssetRune67C`, `AssetRuneB1A`, `AssetRuneNative`
- [asset] Add `isValidAsset` helper

# v.0.4.1 (2020-09-21)

- [calc] Add `getSwapOutputWithFee` method to calculate swap minus transaction fee

# v.0.4.0 (2020-09-10)

- [asset] Add `decimal` property to `AssetAmount` / `BaseAmount`
- [asset] Add `AssetTicker.BNB`
- [asset] Breaking change: Remove `AssetTicker.USD`
- [asset] Breaking change: Remove export of `ASSET_DECIMAL`

# v.0.3.0 (2020-07-09)

- [asset] Breaking change: All values of `Asset` are required (not optional anymore)
- [asset] Breaking change: Rename `getAssetFromString` -> `assetFromString`
- [asset] Add `assetToString` helper
- [asset] Add `EmptyAsset` type, `EMPTY_ASSET` constant and `isEmptyAsset` helper

# v.0.2.1 (2020-07-02)

- [asset] Export `AssetSymbol` + `AssetTicker`

# v.0.2.0 (2020-06-15)

- [asset] Add `getAssetFromString` + type `Asset`
- [asset] Add `formatBaseAmount`
- [asset] Format price of ᚱ ₿ Ξ \$ ⚡
- [asset] Add `decimal` property to `formatAssetAmountCurrency`
- [calc] Use `BaseAmount` instead of `AssetAmount`

# v.0.1.3 (2020-05-28)

- Import Asset Helper Methods

# v.0.1.2 (2020-05-28)

- Add XYK module (swap and slip methods)

# v.0.1.1 (2020-05-23)

- Update to latest dependencies
- Extract library from mono-repo of `asgardex-common` to its own repository https://gitlab.com/thorchain/asgardex-common/asgardex-util

# v.0.1.0 (2020-04-13)

First release
