import {EventEmitter} from 'events';
import {expect} from 'chai';
import sinon from 'sinon';

import {getStream} from '../../js/routes/stream';

let clients;

describe('Stream route', function() {
    describe('getStream', function() {
        beforeEach(function() {
            clients = {
                addToChannel: sinon.stub(),
                removeByIpFromChannel: sinon.stub()
            };
        });

        it('should have correct url', function() {
            const expectedUrl = '/api/stream/:channel';

            expect(getStream.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function() {
            const results = getStream.generateHandler(clients);

            expect(results).to.be.a('function');
        });

        it('should generate a handler to store client connections', function() {
            const populateQueue = sinon.spy();

            const inputRequest = {
                connection: new EventEmitter(),
                ip: '127.0.0.1',
                params: {
                    channel: 'abcd'
                }
            };
            const inputResponse = {
                writeHead: sinon.stub()
            };

            const handler = getStream.generateHandler(clients, populateQueue);

            handler(inputRequest, inputResponse);

            expect(inputResponse.writeHead.calledWith(200, {
                "Content-Type": "audio/mpeg",
                "Connection": "close",
                "Transfer-Encoding": "identity"
            }));
            sinon.assert.calledWith(clients.addToChannel, { res: inputResponse, ip: '127.0.0.1'}, 'abcd');
        });

        it('should generate handler that ignores headers if already exist', function() {
            const populateQueue = sinon.spy();

            const inputRequest = {
                connection: new EventEmitter(),
                ip: '127.0.0.1',
                params: {
                    channel: 'abcd'
                }
            };
            const inputResponse = {
                headers: {
                    "Content-Type": "audio/mpeg"
                },
                writeHead: sinon.stub()
            };

            const handler = getStream.generateHandler(clients, populateQueue);

            handler(inputRequest, inputResponse);

            expect(inputResponse.writeHead.callCount).to.equal(0);
        });

        it('should generate handler that calls populateQueue', function() {
            const populateQueue = sinon.spy();

            const inputRequest = {
                connection: new EventEmitter(),
                ip: '127.0.0.1',
                params: {
                    channel: 'abcd'
                }
            };
            const inputResponse = {
                headers: {
                    "Content-Type": "audio/mpeg"
                },
                writeHead: sinon.stub()
            };

            const handler = getStream.generateHandler(clients, populateQueue);

            handler(inputRequest, inputResponse);

            expect(populateQueue.calledWith('abcd')).to.be.true;
        });

        it('should generate handler that removes client when connection disconnects', function() {
            const populateQueue = sinon.spy();

            const inputRequest = {
                connection: new EventEmitter(),
                ip: '127.0.0.1',
                params: {
                    channel: 'abcd'
                }
            };
            const inputResponse = {
                headers: {
                    "Content-Type": "audio/mpeg"
                },
                writeHead: sinon.stub()
            };

            const handler = getStream.generateHandler(clients, populateQueue);

            handler(inputRequest, inputResponse);

            expect(clients.addToChannel.calledWith({ res: inputResponse, ip: '127.0.0.1' }, 'abcd')).to.equal(true);
            inputRequest.connection.emit('close');
            expect(clients.removeByIpFromChannel.calledWith(inputRequest.ip, 'abcd')).to.equal(true);
        });
    });
});
