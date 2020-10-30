import BigNumber from 'bignumber.js'
import { fixedBN, formatBN } from './bn'
import { trimZeros as trimZerosHelper } from './string'
import { BTCChain, BNBChain, ETHChain, THORChain } from './chain.const'
import { isChain } from './chain'
import { Denomination, AssetAmount, BaseAmount, Amounts, Asset } from './types'

/**
 * Default number of asset decimals
 *
 * For history reason and by starting the project on Binance chain assets, it's 8 decimal.
 *
 * For example:
 * RUNE has a maximum of 8 digits of decimal
 * 0.00000001 RUNE == 1 ð (tor)
 * */
const ASSET_DECIMAL = 8

/**
 * Factory to create values of assets (e.g. RUNE)
 *
 * @param value - Asset amount - If the value is undefined, AssetAmount with value `0` will be returned
 * @param decimal (optional) - Decimal places - default 8
 *
 **/
export const assetAmount = (value: string | number | BigNumber | undefined, decimal: number = ASSET_DECIMAL) =>
  ({
    type: Denomination.ASSET,
    amount: () => fixedBN(value, decimal),
    decimal,
  } as AssetAmount)

/**
 * Factory to create base amounts (e.g. tor)
 *
 * @param value - Base amount - If the value is undefined, BaseAmount with value `0` will be returned
 * @param decimal - Decimal places - default 8
 *
 **/
export const baseAmount = (value: string | number | BigNumber | undefined, decimal: number = ASSET_DECIMAL) =>
  ({
    type: Denomination.BASE,
    amount: () => fixedBN(value, 0),
    decimal,
  } as BaseAmount)

/**
 * Helper to convert values for a asset from base values (e.g. RUNE from tor)
 * */
export const baseToAsset = (base: BaseAmount): AssetAmount => {
  const decimal = base.decimal
  const value = base
    .amount()
    .div(10 ** decimal)
    .decimalPlaces(decimal)
  return assetAmount(value, decimal)
}

/**
 * Helper to convert asset to base values (e.g. tor -> RUNE)
 * */
export const assetToBase = (asset: AssetAmount): BaseAmount => {
  const value = asset
    .amount()
    .multipliedBy(10 ** asset.decimal)
    .integerValue()
  return baseAmount(value)
}

/**
 * Guard to check whether value is an amount of asset or not
 * */
export const isAssetAmount = (v: Amounts): v is AssetAmount => (v as AssetAmount).type === Denomination.ASSET

/**
 * Guard to check whether value is an amount of a base value or not
 * */
export const isBaseAmount = (v: Amounts): v is BaseAmount => (v as BaseAmount).type === Denomination.BASE

/**
 * Formats an `AssetAmount` into `string` based on decimal places
 *
 * If `decimal` is not set, `amount.decimal` is used
 * Note: `trimZeros` wins over `decimal`
 */
export const formatAssetAmount = ({
  amount,
  decimal,
  trimZeros = false,
}: {
  amount: AssetAmount
  decimal?: number
  trimZeros?: boolean
}) => {
  const formatted = formatBN(amount.amount(), decimal || amount.decimal)
  // Note: `trimZeros` wins over `decimal`
  return trimZeros ? trimZerosHelper(formatted) : formatted
}

/**
 * Formats a `BaseAmount` value into a `string`
 */
export const formatBaseAmount = (amount: BaseAmount) => formatBN(amount.amount(), 0)

/**
 * Base "chain" assets
 *
 * Based on definition in Thorchain `common`
 * see https://gitlab.com/thorchain/thornode/-/blob/master/common/asset.go#L12-24
 */
export const AssetBNB: Asset = { chain: BNBChain, symbol: 'BNB', ticker: 'BNB' }
export const AssetBTC: Asset = { chain: BTCChain, symbol: 'BTC', ticker: 'BTC' }
export const AssetETH: Asset = { chain: ETHChain, symbol: 'ETH', ticker: 'ETH' }

export const RUNE_TICKER = 'RUNE'
// Rune67CAsset RUNE on Binance test net
export const AssetRune67C: Asset = { chain: BNBChain, symbol: 'RUNE-67C', ticker: RUNE_TICKER }
// RuneB1AAsset RUNE on Binance main net
export const AssetRuneB1A: Asset = { chain: BNBChain, symbol: 'RUNE-B1A', ticker: RUNE_TICKER }
export const AssetRuneNative: Asset = { chain: THORChain, symbol: RUNE_TICKER, ticker: RUNE_TICKER }

/**
 * Helper to check whether asset is valid
 */
export const isValidAsset = (a: Asset): boolean => !!a.chain && !!a.ticker && !!a.symbol

/**
 * Creates an `Asset` by a given string
 *
 * This helper function expects a string with following naming convention:
 * `AAA.BBB-CCC`
 * where
 * chain: `AAA`
 * ticker (optional): `BBB`
 * symbol: `BBB-CCC` or `CCC` (if no ticker available)
 *
 * @see  https://docs.thorchain.org/developers/transaction-memos#asset-notation
 *
 * If the naming convention fails, it returns null
 */
export const assetFromString = (s: string): Asset | null => {
  const data = s.split('.')
  if (data.length <= 1 || data[1]?.length < 1) {
    return null
  }

  const chain = data[0]
  // filter out not supported string of chains
  if (!chain || !isChain(chain)) return null

  const symbol = data[1]
  const ticker = symbol.split('-')[0]

  return { chain, symbol, ticker }
}

/**
 * Returns an `Asset` as a string using following naming convention:
 *
 * `AAA.BBB-CCC`
 * where
 * chain: `AAA`
 * ticker (optional): `BBB`
 * symbol: `BBB-CCC` or `CCC` (if no ticker available)
 *
 * @see https://docs.thorchain.org/developers/transaction-memos#asset-notation
 *
 */
export const assetToString = ({ chain, symbol }: Asset) => `${chain}.${symbol}`

/**
 * Currency symbols currently supported
 */
export enum AssetCurrencySymbol {
  RUNE = 'ᚱ',
  BTC = '₿',
  SATOSHI = '⚡',
  ETH = 'Ξ',
  USD = '$',
}

/**
 * Returns currency symbols by givven `Asset`
 */
export const currencySymbolByAsset = ({ ticker }: Asset) => {
  switch (true) {
    case ticker === RUNE_TICKER:
      return AssetCurrencySymbol.RUNE
    case ticker === AssetBTC.ticker:
      return AssetCurrencySymbol.BTC
    case ticker === AssetETH.ticker:
      return AssetCurrencySymbol.ETH
    case ticker.includes('USD'):
      return AssetCurrencySymbol.USD
    default:
      return ticker
  }
}

/**
 * Formats an asset amount using its currency symbol
 *
 * If `decimal` is not set, `amount.decimal` is used
 * If `asset` is not set, `$` will be used as currency symbol by default
 * `trimZeros` is `false` by default
 * Note: `trimZeros` wins over `decimal`
 */
export const formatAssetAmountCurrency = ({
  amount,
  asset,
  decimal,
  trimZeros: shouldTrimZeros = false,
}: {
  amount: AssetAmount
  asset?: Asset
  decimal?: number
  trimZeros?: boolean
}) => {
  const amountFormatted = formatAssetAmount({ amount, decimal: decimal || amount.decimal, trimZeros: shouldTrimZeros })
  const ticker = asset?.ticker ?? ''

  if (ticker) {
    // RUNE
    let regex = new RegExp(`${AssetRune67C.ticker}|${AssetRuneB1A.ticker}|${AssetRuneNative.ticker}`, 'i')
    if (ticker.match(regex)) return `${AssetCurrencySymbol.RUNE} ${amountFormatted}`
    // BTC
    regex = new RegExp(AssetBTC.ticker, 'i')
    if (ticker.match(new RegExp(AssetBTC.ticker, 'i'))) {
      const base = assetToBase(amount)
      // format all < ₿ 0.01 in statoshi
      if (base.amount().isLessThanOrEqualTo('1000000')) {
        return `${AssetCurrencySymbol.SATOSHI} ${formatBaseAmount(base)}`
      }
      return `${AssetCurrencySymbol.BTC} ${amountFormatted}`
    }
    // ETH
    regex = new RegExp(AssetETH.ticker, 'i')
    if (ticker.match(regex)) return `${AssetCurrencySymbol.ETH} ${amountFormatted}`
    // USD
    regex = new RegExp('USD', 'i')
    if (ticker.match('USD')) return `${AssetCurrencySymbol.USD} ${amountFormatted}`

    return `${amountFormatted} (${ticker})`
  }

  return `$ ${amountFormatted}`
}

/**
 * Formats a `BaseAmount` into a string of an `AssetAmount`
 *
 * If `decimal` is not set, `amount.decimal` is used
 * Note: `trimZeros` wins over `decimal`
 */
export const formatBaseAsAssetAmount = ({
  amount,
  decimal,
  trimZeros = false,
}: {
  amount: BaseAmount
  decimal?: number
  trimZeros?: boolean
}) => formatAssetAmount({ amount: baseToAsset(amount), decimal, trimZeros })
