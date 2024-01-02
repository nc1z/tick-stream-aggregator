import { Exchange, NormalizedTradeData, Side } from '../types'
import { BinanceAggTradeResponse } from './binance'
import { BitmexTradeResponse } from './bitmex'
import { BybitTradeResponse } from './bybit'

export function normalizeBinanceTrade(trade: BinanceAggTradeResponse): NormalizedTradeData {
    const side = trade.m ? Side.SELL : Side.BUY
    return {
        side,
        exchange: Exchange.BINANCE,
        price: Number(trade.p),
        quantity: Number(trade.q),
        size: Number(trade.p) * Number(trade.q),
        time: trade.T,
    }
}

export function normalizeBybitTrade(response: BybitTradeResponse): NormalizedTradeData {
    const aggregatedTrade = response.data.reduce(
        (acc, trade) => {
            const quantity = trade.S === 'Sell' ? Number(trade.v) * -1 : Number(trade.v)
            const size = Number(trade.p) * quantity

            acc.quantity += quantity
            acc.size += size

            return acc
        },
        { quantity: 0, size: 0 },
    )

    const side = aggregatedTrade.size < 0 ? Side.SELL : Side.BUY

    return {
        side,
        exchange: Exchange.BYBIT,
        price: Math.abs(aggregatedTrade.size / aggregatedTrade.quantity),
        quantity: Math.abs(aggregatedTrade.quantity),
        size: Math.abs(aggregatedTrade.size),
        time: response.ts,
    }
}

// @BUG: Mapper is wrong. Should not sum up trades within response.data for bitmex
// @TODO: Update mapper
export function normalizeBitmexTrade(response: BitmexTradeResponse): NormalizedTradeData {
    const aggregatedTrade = response.data.reduce(
        (acc, trade) => {
            const size = trade.side === 'Sell' ? Number(trade.grossValue) * -1 : Number(trade.grossValue)
            const quantity = size / trade.price

            acc.size += size
            acc.quantity += quantity

            return acc
        },
        { quantity: 0, size: 0 },
    )

    const side = aggregatedTrade.size < 0 ? Side.SELL : Side.BUY

    return {
        side,
        exchange: Exchange.BITMEX,
        price: Math.abs(aggregatedTrade.size / aggregatedTrade.quantity),
        quantity: Math.abs(aggregatedTrade.quantity),
        size: Math.abs(aggregatedTrade.size),
        time: Date.parse(response.data[0].timestamp),
    }
}
