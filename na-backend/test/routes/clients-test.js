import {expect} from 'chai';
import sinon from 'sinon';

import {getClients} from '../../js/routes/clients';

let clients;

describe('Clients route', function () {
    describe('getClients', function () {
        beforeEach(function() {
            clients = {
                count: sinon.stub().returns(5)
            };
        })

        it('should have correct url', function () {
            const expectedUrl = '/api/clients';

            expect(getClients.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function () {
            const results = getClients.generateHandler(clients);
            expect(results).to.be.a('function');
        });

        it('should return count of current connected clients', function () {
            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            const expectedResponse = JSON.stringify({ count: 5 });

            const handler = getClients.generateHandler(clients);
            handler(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith(expectedResponse)).to.be.true;
        });
    });
});
