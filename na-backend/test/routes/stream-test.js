import {getStream} from '../../js/routes/stream';
import {expect} from 'chai';
import sinon from 'sinon';

describe('Stream route', function() {
    describe('getStream', function() {
        it('should have correct url', function() {
            const expectedUrl = '/stream';

            expect(getStream.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function() {
            const clients = [];

            const results = getStream.generateHandler(clients);

            expect(results).to.be.a('function');
        });

        it('should generate a handler to store client connections', function() {
            const clients = [];
            const songQueue = [];
            const populateQueue = sinon.spy();

            const inputRequest = {};
            const inputResponse = {
                writeHead: function() { }
            };

            const spy = sinon.spy(inputResponse, 'writeHead');

            const handler = getStream.generateHandler(clients, songQueue, populateQueue);

            handler(inputRequest, inputResponse);

            expect(spy.calledWith(200, {
                "Content-Type": "audio/mpeg",
                "Connection": "close",
                "Transfer-Encoding": "identity"
            }));
            expect(clients).to.eql([{ res: inputResponse }]);
        });

        it('should generate handler that ignores headers if already exist', function() {
            const clients = [];
            const songQueue = [];
            const populateQueue = sinon.spy();

            const inputRequest = {};
            const inputResponse = {
                headers: {
                    "Content-Type": "audio/mpeg"
                },
                writeHead: function() { }
            };

            const spy = sinon.spy(inputResponse, 'writeHead');

            const handler = getStream.generateHandler(clients, songQueue, populateQueue);

            handler(inputRequest, inputResponse);

            expect(spy.callCount).to.equal(0);
            expect(clients).to.eql([{ res: inputResponse }]);
        });

        it('should generate handler that calls populateQueue if song queue is empty', function() {
            const clients = [];
            const songQueue = [];
            const populateQueue = sinon.spy();

            const inputRequest = {};
            const inputResponse = {
                headers: {
                    "Content-Type": "audio/mpeg"
                },
                writeHead: function() { }
            };

            const spy = sinon.spy(inputResponse, 'writeHead');

            const handler = getStream.generateHandler(clients, songQueue, populateQueue);

            handler(inputRequest, inputResponse);

            expect(populateQueue.called).to.be.true;
        })

        it('should generate handler that does not call populateQueue if queue contains songs', function() {
            const clients = [];
            const songQueue = ['xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'];
            const populateQueue = sinon.spy();

            const inputRequest = {};
            const inputResponse = {
                headers: {
                    "Content-Type": "audio/mpeg"
                },
                writeHead: function() { }
            };

            const spy = sinon.spy(inputResponse, 'writeHead');

            const handler = getStream.generateHandler(clients, songQueue, populateQueue);

            handler(inputRequest, inputResponse);

            expect(populateQueue.called).to.be.false;
        });
    });
});
