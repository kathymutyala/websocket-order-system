const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const { sendOrderUpdates } = require('../websocket-server'); 

describe('sendOrderUpdates', () => {
    let ws;

    beforeEach(() => {
        ws = { send: sinon.spy() };
    });

    it('should send 10 updates after 1 second', (done) => {
        sendOrderUpdates(ws);

        setTimeout(() => {
            expect(ws.send.callCount).to.be.at.least(10);
            done();
        }, 1000);
    });

});
