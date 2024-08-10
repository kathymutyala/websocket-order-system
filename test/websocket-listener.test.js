const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const { determineAction } = require('../websocket-listener'); 

describe('determineAction', () => {
    it('should return placeOrder when conditions are met', () => {
        const order = {
            AppOrderID: 1111075001,
            priceType: 'MKT',
            status: 'complete'
        };
        const result = determineAction(order);
        expect(result).to.equal('placeOrder');
    });

    it('should return null when no conditions are met', () => {
        const order = {
            AppOrderID: 1111075003,
            priceType: 'LMT',
            status: 'unknown'
        };
        const result = determineAction(order);
        expect(result).to.be.null;
    });
});
