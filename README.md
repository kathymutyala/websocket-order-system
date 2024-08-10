# WebSocket Order Update System

## Overview

This project includes a WebSocket server and a WebSocket listener that handle order updates. The server sends order updates at specified intervals, while the listener processes these updates, filtering out duplicates and redundant updates, determining appropriate actions (placeOrder, modifyOrder, cancelOrder), and logging all activities.

## Features

- **WebSocket Server**: Sends batches of order updates to clients with specified delays.
- **WebSocket Listener**: Receives updates, filters out redundant and duplicate updates, determines actions based on order details, aggregates updates, and logs all activities.

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kathymutyala/websocket-order-system.git
   cd websocket-order-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the WebSocket Server

1. **Navigate to the server file**:
   ```bash
   cd websocket-order-system
   ```

2. **Run the WebSocket server**:
   ```bash
   node websocket-server.js
   ```

   The server will start on `ws://localhost:8080` and will send order updates to any connected client.

## Running the WebSocket Listener

1. **Navigate to the listener file**:
   ```bash
   cd websocket-order-system
   ```

2. **Run the WebSocket listener**:
   ```bash
   node websocket-listener.js
   ```

   The listener will connect to the WebSocket server at `ws://localhost:8080`, receive updates, process them, and log the activities.

## Running the Unit Tests

Please stop the server and listener and make sure that the port 8080 is not in use.

1. **Navigate to the root directory**:
   ```bash
   cd websocket-order-system
   ```

2. **Run the WebSocket listener**:
   ```bash
   npx mocha
   ```


## Documentation

### WebSocket Server (`websocket-server.js`)

- **Description**: The server sends order updates to connected clients at specified intervals.
  
- **Order Update Batches**:
  - 10 updates after 1 second
  - 20 updates after 2 seconds
  - 40 updates after 3 seconds
  - 30 updates after 5 seconds
  
- **Logging**: Each order update sent is logged to the console.

### WebSocket Listener (`websocket-listener.js`)

- **Description**: The listener receives order updates from the server, filters out duplicates and redundant updates, determines appropriate actions, and logs all activities.

- **Features**:
  - **Filtering**: Redundant updates (those with matching `AppOrderID`, `price`, `triggerPrice`, `priceType`, `productType`, `status`, `exchange`, `symbol`) are filtered out.
  - **Action Determination**: Based on the order details, the listener determines whether to `placeOrder`, `modifyOrder`, or `cancelOrder`.
  - **Aggregation**: If multiple updates are received within 1 second, only one update is processed, and the rest are discarded.
  - **Logging**: All received updates, filtered updates, actions taken, and updates sent to the action handler are logged to the console.

### Action Logic

- **placeOrder**: Triggered when:
  - `priceType` is "MKT" and `status` is "complete" and the order does not exist.
  - `priceType` is "LMT" and `status` is "open" and the order does not exist.
  - `priceType` is "SL-LMT" or "SL-MKT" and `status` is "pending" and the order does not exist.

- **modifyOrder**: Triggered when:
  - `priceType` is "MKT" and `status` is "complete" and the order exists.
  - `priceType` is "LMT" and `status` is "open" and the order exists.
  - `priceType` is "SL-LMT" or "SL-MKT" and `status` is "pending" and the order exists.

- **cancelOrder**: Triggered when:
  - `priceType` is "LMT", "SL-LMT", or "SL-MKT" and `status` is "cancelled".

## Example Logs

- **Order Update Sent by Server**:
  ```bash
  Sent: {"AppOrderID":1111075075,"price":2,"triggerPrice":4,"priceType":"MKT","productType":"I","status":"complete","CumulativeQuantity":0,"LeavesQuantity":1,"OrderGeneratedDateTimeAPI":"2024-07-23T10:16:17.000Z","transaction":"buy","AlgoID":"","exchange":"NSE","symbol":"IDEA"}
  ```

- **Filtered Redundant Update by Listener**:
  ```bash
  Filtered redundant update: {"AppOrderID":1111075075,"price":2,"triggerPrice":4,"priceType":"MKT","productType":"I","status":"complete","CumulativeQuantity":0,"LeavesQuantity":1,"OrderGeneratedDateTimeAPI":"2024-07-23T10:16:17.000Z","transaction":"buy","AlgoID":"","exchange":"NSE","symbol":"IDEA"}
  ```

- **Action Taken by Listener**:
  ```bash
  Action: placeOrder, Order: {"AppOrderID":1111075076,"price":3,"triggerPrice":5,"priceType":"MKT","productType":"I","status":"complete","CumulativeQuantity":0,"LeavesQuantity":1,"OrderGeneratedDateTimeAPI":"2024-07-23T10:16:18.000Z","transaction":"buy","AlgoID":"","exchange":"NSE","symbol":"RELIANCE"}
  ```

