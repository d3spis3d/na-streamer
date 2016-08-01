import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon'

import {addToQueue, getQueue, removeFromQueue} from '../../js/routes/queue';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Queue route', function() {
    describe('addToQueue', function() {
        it('should have correct url', function() {
            const expectedUrl = '/api/queue/:channel';

            expect(addToQueue.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function() {
            const db = {};

            const results = addToQueue.generateHandler(db);
            expect(results).to.be.a('function');
        });

        it('should generate a handler that adds a song to the queue', function(done) {
            const addToChannelQueue = sinon.stub().returns(Promise.resolve());
            const db = sinon.stub();
            const req = {
                body: {
                    rid: '#1:1'
                },
                params: {
                    channel: 'abcde'
                }
            };
            const res = {
                sendStatus: sinon.spy()
            };

            const handler = addToQueue.generateHandler(db, addToChannelQueue);

            const result = handler(req, res);

            expect(result).to.eventually.be.fulfilled.then(function() {
                expect(addToChannelQueue.calledWith(db, '#1:1', 'abcde')).to.be.true;
                expect(res.sendStatus.calledWith(200)).to.be.true;
                done();
            });
        });
    });

    describe('getQueue', function() {
        it('should have correct url', function() {
            const expectedUrl = '/api/queue/:channel';

            expect(getQueue.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function() {
            const db = {};

            const results = getQueue.generateHandler(db);
            expect(results).to.be.a('function');
        });

        it('should generate a handler that returns songs on queue', function(done) {
            const results = [
                { title: 'Song One', id: 'xxxx', album: 'Album', artist: 'Artist', rid: '#1:5' },
                { title: 'Song 2', id: 'yyyy', album: 'Album', artist: 'Artist', rid: '#1:1' }
            ];

            const listQueueForChannel = sinon.stub().returns(Promise.resolve(results));
            const db = sinon.stub();

            const req = {
                params: {
                    channel: 'abcde'
                }
            };
            const res = {
                send: sinon.spy()
            };

            const handler = getQueue.generateHandler(db, listQueueForChannel);
            const result = handler(req, res);

            expect(result).to.eventually.be.fulfilled.then(function() {
                expect(listQueueForChannel.calledWith(db, 'abcde')).to.be.true;
                expect(res.send.calledWith(JSON.stringify(results))).to.be.true;
                done();
            });
        });
    });

    describe('removeFromQueue', function () {
        it('should have the correct url', function () {
            const expectedUrl = '/api/queue/:channel';

            expect(removeFromQueue.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function () {
            const db = {};

            const results = removeFromQueue.generateHandler(db);
            expect(results).to.be.a('function');
        });

        it('should generate a handler that deletes from the queue based on rid', function (done) {
            const removeFromChannelQueue = sinon.stub().returns(Promise.resolve());
            const db = sinon.stub();

            const req = {
                body: {
                    rid: '#13:1'
                },
                params: {
                    channel: 'abcde'
                }
            };
            const res = {
                sendStatus: sinon.stub()
            };

            const handler = removeFromQueue.generateHandler(db, removeFromChannelQueue);
            const result = handler(req, res);

            expect(result).to.eventually.be.fulfilled.then(function() {
                expect(removeFromChannelQueue.calledWith(db, '#13:1', 'abcde'));
                expect(res.sendStatus.calledWith(200)).to.be.true;
                done();
            });
        });
    });
});
