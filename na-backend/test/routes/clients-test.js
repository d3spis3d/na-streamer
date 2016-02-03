import {expect} from 'chai';
import sinon from 'sinon';

import {getClients} from '../../js/routes/clients';

describe('Clients route', function () {
    describe('getClients', function () {
        it('should have correct url', function () {
            const expectedUrl = '/clients';

            expect(getClients.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function () {
            const clients = [];

            const results = getClients.generateHandler(clients);
            expect(results).to.be.a('function');
        });

        it('should return count of current connected clients', function () {
            const clients = [
                { ip: '127.0.0.1' },
                { ip: '0.0.0.0' }
            ];

            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            const expectedResponse = JSON.stringify({ count: 2});

            const handler = getClients.generateHandler(clients);
            handler(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith(expectedResponse)).to.be.true;
        });
    });
});
