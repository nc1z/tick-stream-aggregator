import { arrayBufferToString, logTrade } from '../src/helpers'
import logger from '../src/logger'
import { Exchange, Side } from '../src/types'

jest.mock('../src/logger.ts', () => ({
    info: jest.fn(),
}))

describe('helpers', () => {
    describe('logTrade', () => {
        afterEach(() => {
            jest.clearAllMocks()
        })

        const mockCurrentTime = 1704082477257
        const options: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
        }
        const mockFormattedTime = new Date(mockCurrentTime).toLocaleTimeString(undefined, options)

        test('should log trade (>=1,000,000) with formatted size (in M)', () => {
            logTrade(Exchange.BINANCE, 40000, 4000000, Side.BUY, mockCurrentTime)
            expect(logger.info).toHaveBeenCalledWith(
                `[${mockFormattedTime}] [BINANCE] [BUY]  40000 [4.0M]   [====================]`,
            )
        })

        test('should log trade (>=1,000) with formatted size (in K)', () => {
            logTrade(Exchange.BINANCE, 40000, 20000, Side.BUY, mockCurrentTime)
            expect(logger.info).toHaveBeenCalledWith(
                `[${mockFormattedTime}] [BINANCE] [BUY]  40000 [20.0K]  [=                   ]`,
            )
        })

        test('should log trade (>=100) with formatted size (in K)', () => {
            logTrade(Exchange.BINANCE, 40000, 400, Side.BUY, mockCurrentTime)
            expect(logger.info).toHaveBeenCalledWith(
                `[${mockFormattedTime}] [BINANCE] [BUY]  40000 [0.4K]   [=                   ]`,
            )
        })

        test('should log trade (<100) with formatted size (default)', () => {
            logTrade(Exchange.BINANCE, 40000, 40, Side.BUY, mockCurrentTime)
            expect(logger.info).toHaveBeenCalledWith(
                `[${mockFormattedTime}] [BINANCE] [BUY]  40000 [0.04K]  [=                   ]`,
            )
        })

        test('should log trade (SELL) with formatted size (default)', () => {
            logTrade(Exchange.BINANCE, 40000, 40, Side.SELL, mockCurrentTime)
            expect(logger.info).toHaveBeenCalledWith(
                `[${mockFormattedTime}] [BINANCE] [SELL] 40000 [0.04K]  [=                   ]`,
            )
        })
    })

    describe('arrayBufferToString', () => {
        test('should return a string', () => {
            const text = 'Hello, World!'
            const encoder = new TextEncoder()
            const arrayBuffer = encoder.encode(text)
            const result = arrayBufferToString(arrayBuffer)
            expect(result).toBe(text)
        })
    })
})
