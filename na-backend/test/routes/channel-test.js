import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import {getChannels, createChannel, deleteChannel} from '../../js/routes/channel';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Channel routes', function() {
    describe('getChannels', function() {
        it('should have the correct url', function() {
            const expectedUrl = '/api/channel';

            expect(getChannels.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function() {
            const db = sinon.stub();
            const listChannels = sinon.stub();

            const handler = getChannels.generateHandler(db, listChannels);
            expect(handler).to.be.a('function');
        });

        it('should return a list of channels', function(done) {
            const channelResults = ['Channel1', 'Channel2'];
            const listChannels = sinon.stub().returns(Promise.resolve(channelResults));
            const db = sinon.stub();

            const res = {
                send: sinon.stub()
            };

            const handler = getChannels.generateHandler(db, listChannels);
            const results = handler({}, res);

            expect(results).to.eventually.be.fulfilled.then(function() {
                sinon.assert.calledWith(listChannels, db);
                sinon.assert.calledWith(res.send, JSON.stringify(channelResults));
                done();
            });
        });
    });

    describe('createChannel', function() {
        it('should have the correct url', function() {
            const expectedUrl = '/api/channel';

            expect(createChannel.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function() {
            const db = sinon.stub();
            const create = sinon.stub();

            const handler = createChannel.generateHandler(db, create);
            expect(handler).to.be.a('function');
        });

        it('should create a channel', function(done) {
            const db = sinon.stub();
            const create = sinon.stub().returns(Promise.resolve());

            const req = {
                body: {
                    title: 'Channel1'
                }
            };
            const res = {
                sendStatus: sinon.stub()
            };

            const handler = createChannel.generateHandler(db, create);
            const results = handler(req, res);

            expect(results).to.eventually.be.fulfilled.then(function() {
                sinon.assert.calledWith(create, db, 'Channel1', sinon.match.string);
                sinon.assert.calledWith(res.sendStatus, 200);
                done();
            });
        });
    });

    describe('deleteChannel', function() {
        it('should have the correct url', function() {
            const expectedUrl = '/api/channel';

            expect(createChannel.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function() {
            const db = sinon.stub();
            const deleteQuery = sinon.stub();

            const handler = deleteChannel.generateHandler(db, deleteQuery);
            expect(handler).to.be.a('function');
        });

        it('should delete a channel', function(done) {
            const db = sinon.stub();
            const deleteQuery = sinon.stub().returns(Promise.resolve());

            const req = {
                params: {
                    key: 'abcdef'
                }
            };
            const res = {
                sendStatus: sinon.stub()
            };

            const handler = deleteChannel.generateHandler(db, deleteQuery);
            const results = handler(req, res);

            expect(results).to.eventually.be.fulfilled.then(function() {
                sinon.assert.calledWith(deleteQuery, db, 'abcdef');
                sinon.assert.calledWith(res.sendStatus, 200);
                done();
            });
        });
    });
});
