import { Exchange, NormalizedTradeData } from '../types'
import { BinanceAggTradeResponse } from './binance'
import { BybitTradeResponse } from './bybit'

export function normalizeBinanceTrade(trade: BinanceAggTradeResponse): NormalizedTradeData {
    const quantity = trade.m ? Number(trade.q) * -1 : Number(trade.q)
    return {
        exchange: Exchange.BINANCE,
        price: Number(trade.p),
        quantity: quantity,
        size: Number(trade.p) * quantity,
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
        { exchange: Exchange.BYBIT, quantity: 0, size: 0 },
    )

    return {
        ...aggregatedTrade,
        price: aggregatedTrade.size / aggregatedTrade.quantity,
        time: response.ts,
    }
}
