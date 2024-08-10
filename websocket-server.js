const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

// Create WebSocket server
const server = new WebSocket.Server({ port: 8080 });

// Function to send order updates
function sendOrderUpdates(ws) {
    const createOrderUpdate = (id) => ({
        AppOrderID: 1111075000 + id,
        price: Math.floor(Math.random() * 10) + 1,
        triggerPrice: Math.floor(Math.random() * 10) + 1,
        priceType: ["MKT", "LMT", "SL-LMT", "SL-MKT"][Math.floor(Math.random() * 4)],
        productType: "I",
        status: ["complete", "open", "pending", "cancelled"][Math.floor(Math.random() * 4)],
        CumulativeQuantity: 0,
        LeavesQuantity: 1,
        OrderGeneratedDateTimeAPI: new Date().toISOString(),
        transaction: ["buy", "sell"][Math.floor(Math.random() * 2)],
        AlgoID: "",
        exchange: "NSE",
        symbol: ["IDEA", "RELIANCE", "TATA", "BAJAJ", "WIPRO", "ONGC"][Math.floor(Math.random() * 6)]
    });

    // Send updates in batches with specified delays
    let totalUpdates = 0;

    const sendUpdates = (count, delay) => {
        setTimeout(() => {
            for (let i = 0; i < count; i++) {
                totalUpdates += 1;
                const update = createOrderUpdate(totalUpdates);
                ws.send(JSON.stringify(update));
                console.log(`Sent: ${JSON.stringify(update)}`);
            }
        }, delay);
    };

    sendUpdates(10, 1000); // First 10 updates in 1 second
    sendUpdates(20, 3000); // Next 20 updates after 2 seconds
    sendUpdates(40, 6000); // 40 updates after 3 seconds
    sendUpdates(30, 11000); // Final 30 updates after 5 seconds
}

// WebSocket server connection event
server.on('connection', (ws) => {
    console.log('Client connected');
    sendOrderUpdates(ws);
    
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

module.exports = { sendOrderUpdates };

