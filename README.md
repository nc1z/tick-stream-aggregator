# Bitcoin Tick Stream Aggregator

Live trade feed aggregator server streaming BTC time and sales data from major exchanges like Binance, Bybit, BitMEX and more via a unified WebSocket API

**Tick stream example**

> :construction: Work in progress!

![image](https://github.com/nc1z/tick-stream-aggregator/assets/111836326/f24948ab-a7ed-49c4-971a-b46a38887907)

## Websocket Market Stream

Base Url: `ws://localhost:8081/`

Example response

```json
{
    "exchange": "BINANCE",
    "price": 42364.6,
    "quantity": 3.626,
    "size": 153614.0396,
    "time": 1704089838366
}
```

## Getting started

Users can choose to run this locally or via spinning up a docker instance.

### Docker

> :construction: Work in progress!

### Local development

To run the server locally

Clone the repository

```bash
git clone https://github.com/nc1z/tick-stream-aggregator.git
```

Navigate into directory

```bash
cd tick-stream-aggregator/
```

Install dependencies

```bash
yarn install
```

Start the server

```bash
yarn start
```

## Custom configuration

For customisation, please pass the arguments as such

```bash
yarn start [command] [options]

# Example
yarn start --port 3000 --size 10000
```

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
