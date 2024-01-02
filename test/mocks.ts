import { BinanceAggTradeResponse } from '../src/producers'
import { BitmexTradeResponse } from '../src/producers/bitmex'
import { BybitTradeResponse } from '../src/producers/bybit'
import { Exchange, NormalizedTradeData, Side } from '../src/types'

export const mockBinanceAggTradeResponse: BinanceAggTradeResponse = {
    e: 'aggTrade',
    E: 1704043668175,
    s: 'BTCUSDT',
    a: 2807515140,
    p: '42526.19000000',
    q: '0.02762000',
    f: 3344470977,
    l: 3344470977,
    T: 1704043668174,
    m: false,
    M: true,
}

export const mockBybitTradeResponse: BybitTradeResponse = {
    topic: 'publicTrade.BTCUSDT',
    type: 'snapshot',
    ts: 1672304486868,
    data: [
        {
            T: 1672304486865,
            s: 'BTCUSDT',
            S: 'Buy',
            v: '0.001',
            p: '16578.50',
            L: 'PlusTick',
            i: '20f43950-d8dd-5b31-9112-a178eb6023af',
            BT: false,
        },
    ],
}

export const mockBitmexTradeResponse: BitmexTradeResponse = {
    table: 'trade',
    action: 'insert',
    data: [
        {
            timestamp: '2024-01-02T15:17:11.553Z',
            symbol: 'XBTUSD',
            side: 'Sell',
            size: 3100,
            price: 45091.5,
            tickDirection: 'ZeroMinusTick',
            trdMatchID: '00000000-006d-1000-0000-0003b66bfd1f',
            grossValue: 6874901,
            homeNotional: 0.06874901,
            foreignNotional: 3100,
            trdType: 'Regular',
        },
    ],
}

export const mockBinanceNormalizedTrade: NormalizedTradeData = {
    side: Side.BUY,
    exchange: Exchange.BINANCE,
    price: Number(mockBinanceAggTradeResponse.p),
    quantity: Number(mockBinanceAggTradeResponse.q),
    size: Number(mockBinanceAggTradeResponse.p) * Number(mockBinanceAggTradeResponse.q),
    time: mockBinanceAggTradeResponse.T,
}

export const mockBybitNormalizedTrade: NormalizedTradeData = {
    side: Side.BUY,
    exchange: Exchange.BYBIT,
    price: Number(mockBybitTradeResponse.data[0].p),
    quantity: Number(mockBybitTradeResponse.data[0].v),
    size: Number(mockBybitTradeResponse.data[0].p) * Number(mockBybitTradeResponse.data[0].v),
    time: mockBybitTradeResponse.ts,
}

export const mockBitmexNormalizedTrade: NormalizedTradeData = {
    side: Side.SELL,
    exchange: Exchange.BITMEX,
    price: Number(mockBitmexTradeResponse.data[0].price),
    quantity: Number(mockBitmexTradeResponse.data[0].grossValue) / Number(mockBitmexTradeResponse.data[0].price),
    size: Number(mockBitmexTradeResponse.data[0].grossValue),
    time: Date.parse(mockBitmexTradeResponse.data[0].timestamp),
}
