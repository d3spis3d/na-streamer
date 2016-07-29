import {EventEmitter} from 'events';
import {expect} from 'chai';
import sinon from 'sinon';

import {getStream} from '../../js/routes/stream';

describe('Stream route', function() {
    describe('getStream', function() {
        it('should have correct url', function() {
            const expectedUrl = '/api/stream';

            expect(getStream.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function() {
            const clients = [];

            const results = getStream.generateHandler(clients);

            expect(results).to.be.a('function');
        });

        it('should generate a handler to store client connections', function() {
            const clients = [];
            const populateQueue = sinon.spy();

            const inputRequest = {
                connection: new EventEmitter(),
                ip: '127.0.0.1'
            };
            const inputResponse = {
                writeHead: function() { }
            };

            const spy = sinon.spy(inputResponse, 'writeHead');

            const handler = getStream.generateHandler(clients, populateQueue);

            handler(inputRequest, inputResponse);

            expect(spy.calledWith(200, {
                "Content-Type": "audio/mpeg",
                "Connection": "close",
                "Transfer-Encoding": "identity"
            }));
            expect(clients).to.eql([{ res: inputResponse, ip: '127.0.0.1' }]);
        });

        it('should generate handler that ignores headers if already exist', function() {
            const clients = [];
            const populateQueue = sinon.spy();

            const inputRequest = {
                connection: new EventEmitter(),
                ip: '127.0.0.1'
            };
            const inputResponse = {
                headers: {
                    "Content-Type": "audio/mpeg"
                },
                writeHead: function() { }
            };

            const spy = sinon.spy(inputResponse, 'writeHead');

            const handler = getStream.generateHandler(clients, populateQueue);

            handler(inputRequest, inputResponse);

            expect(spy.callCount).to.equal(0);
            expect(clients).to.eql([{ res: inputResponse, ip: '127.0.0.1' }]);
        });

        it('should generate handler that calls populateQueue', function() {
            const clients = [];
            const populateQueue = sinon.spy();

            const inputRequest = {
                connection: new EventEmitter(),
                ip: '127.0.0.1'
            };
            const inputResponse = {
                headers: {
                    "Content-Type": "audio/mpeg"
                },
                writeHead: function() { }
            };

            const spy = sinon.spy(inputResponse, 'writeHead');

            const handler = getStream.generateHandler(clients, populateQueue);

            handler(inputRequest, inputResponse);

            expect(populateQueue.called).to.be.true;
        });

        it('should generate handler that removes client when connection disconnects', function() {
            const clients = [];
            const populateQueue = sinon.spy();

            const inputRequest = {
                connection: new EventEmitter(),
                ip: '127.0.0.1'
            };
            const inputResponse = {
                headers: {
                    "Content-Type": "audio/mpeg"
                },
                writeHead: function() { }
            };

            const spy = sinon.spy(inputResponse, 'writeHead');

            const handler = getStream.generateHandler(clients, populateQueue);

            handler(inputRequest, inputResponse);

            expect(clients).to.eql([{ res: inputResponse, ip: '127.0.0.1' }]);
            inputRequest.connection.emit('close');
            expect(clients).to.eql([]);
        });
    });
});
