import { normalizeBinanceTrade, normalizeBitmexTrade, normalizeBybitTrade } from '../src/producers/mapper'
import {
    mockBinanceAggTradeResponse,
    mockBinanceNormalizedTrade,
    mockBitmexNormalizedTrade,
    mockBitmexTradeResponse,
    mockBybitNormalizedTrade,
    mockBybitTradeResponse,
} from './mocks'

describe('mappers', () => {
    describe('normalizeBinanceTrade', () => {
        test('should return normalized trade data', () => {
            expect(normalizeBinanceTrade(mockBinanceAggTradeResponse)).toEqual(mockBinanceNormalizedTrade)
        })
    })

    describe('normalizeBybitTrade', () => {
        test('should return normalized trade data', () => {
            expect(normalizeBybitTrade(mockBybitTradeResponse)).toEqual(mockBybitNormalizedTrade)
        })
    })

    describe('normalizeBitmexTrade', () => {
        test('should return normalized trade data', () => {
            expect(normalizeBitmexTrade(mockBitmexTradeResponse)).toEqual(mockBitmexNormalizedTrade)
        })
    })
})
