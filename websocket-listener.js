const WebSocket = require('ws');

// Connect to WebSocket server
const client = new WebSocket('ws://localhost:8080');

// Store for received orders
const orderStore = new Map();
let updateBuffer = [];
let lastUpdateTime = 0;

// Determine action based on order details
function determineAction(order) {
    const existingOrder = orderStore.get(order.AppOrderID);
    if (!existingOrder) {
        // placeOrder conditions
        if ((order.priceType === "MKT" && order.status === "complete") ||
            (order.priceType === "LMT" && order.status === "open") ||
            ((order.priceType === "SL-LMT" || order.priceType === "SL-MKT") && order.status === "pending")) {
            return 'placeOrder';
        }
    } else {
        // modifyOrder conditions
        if ((order.priceType === "MKT" && order.status === "complete") ||
            (order.priceType === "LMT" && order.status === "open") ||
            ((order.priceType === "SL-LMT" || order.priceType === "SL-MKT") && order.status === "pending")) {
            return 'modifyOrder';
        }
        // cancelOrder conditions
        if (order.status === "cancelled") {
            return 'cancelOrder';
        }
    }
    return null;
}

// Aggregate and handle updates
function handleUpdates() {
    const now = Date.now();

    if (now - lastUpdateTime >= 1000) {
        // Process the buffer
        updateBuffer.forEach(update => {
            const action = determineAction(update);
            if (action) {
                console.log(`Action: ${action}, Order: ${JSON.stringify(update)}`);
                orderStore.set(update.AppOrderID, update);
            }
        });
        updateBuffer = [];
        lastUpdateTime = now;
    }

    setTimeout(handleUpdates, 1000);
}

// WebSocket client event handlers
client.on('open', () => {
    console.log('Connected to WebSocket server');
    handleUpdates();
});

client.on('message', (data) => {
    const order = JSON.parse(data);

    // Filter out duplicates and redundant updates
    const existingOrder = orderStore.get(order.AppOrderID);
    if (existingOrder &&
        existingOrder.price === order.price &&
        existingOrder.triggerPrice === order.triggerPrice &&
        existingOrder.priceType === order.priceType &&
        existingOrder.productType === order.productType &&
        existingOrder.status === order.status &&
        existingOrder.exchange === order.exchange &&
        existingOrder.symbol === order.symbol) {
        console.log(`Filtered redundant update: ${JSON.stringify(order)}`);
        return;
    }

    // Add to buffer
    updateBuffer.push(order);
    console.log(`Received: ${JSON.stringify(order)}`);
});

client.on('close', () => {
    console.log('Disconnected from WebSocket server');
});

module.exports = { determineAction };
