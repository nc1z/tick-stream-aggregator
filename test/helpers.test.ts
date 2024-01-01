import { logTrade } from '../src/helpers'
import logger from '../src/logger'
import { Exchange } from '../src/types'

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

        it('should log trade (>=1,000,000) with formatted size (in M)', () => {
            logTrade(Exchange.BINANCE, 40000, 100, mockCurrentTime)
            expect(logger.info).toHaveBeenCalledWith(`[${mockFormattedTime}] [BINANCE] 40000 [4.0M]`)
        })

        it('should log trade (>=1,000) with formatted size (in K)', () => {
            logTrade(Exchange.BINANCE, 40000, 0.5, mockCurrentTime)
            expect(logger.info).toHaveBeenCalledWith(`[${mockFormattedTime}] [BINANCE] 40000 [20.0K]`)
        })

        it('should log trade (>=100) with formatted size (in K)', () => {
            logTrade(Exchange.BINANCE, 40000, 0.01, mockCurrentTime)
            expect(logger.info).toHaveBeenCalledWith(`[${mockFormattedTime}] [BINANCE] 40000 [0.4K]`)
        })

        it('should log trade (<100) with formatted size (default)', () => {
            logTrade(Exchange.BINANCE, 40000, 0.001, mockCurrentTime)
            expect(logger.info).toHaveBeenCalledWith(`[${mockFormattedTime}] [BINANCE] 40000 [0.04K]`)
        })
    })
})
