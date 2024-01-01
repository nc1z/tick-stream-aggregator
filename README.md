# Trade Stream Aggregator

Live trade feed aggregator server streaming BTC time and sales data from major exchanges like Binance, Bybit, BitMEX and more via a unified WebSocket API

> Work in progress!

## Acknowledgement and references

Special thanks to the following developers and repositories for the inspiration, references and documentation

Inspiration for the idea

-   [AGGR](https://github.com/Tucsky/aggr-server) - server side cryptocurrency trades aggregator

NodeJs design choices and optimisation

-   [Tardis.dev](https://github.com/tardis-dev) - The most granular data for cryptocurrency markets

Dependencies

-   [uWebSockets](https://github.com/uNetworking/uWebSockets.js/tree/master) - ws for NodeJs back-ends
-   [Pino](https://github.com/pinojs/pino?tab=readme-ov-file) - super fast, all natural json logger
-   [findMyWay](https://github.com/delvedor/find-my-way) - A crazy fast HTTP router
