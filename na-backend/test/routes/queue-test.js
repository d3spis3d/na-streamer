import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon'

import {addToQueue, getQueue, removeFromQueue} from '../../js/routes/queue';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Queue route', function() {
    describe('addToQueue', function() {
        it('should have correct url', function() {
            const expectedUrl = '/queue';

            expect(addToQueue.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function() {
            const db = {};

            const results = addToQueue.generateHandler(db);
            expect(results).to.be.a('function');
        });

        it('should generate a handler that adds a song to the queue', function(done) {
            const db = {
                query: sinon.stub().returns(Promise.resolve())
            };
            const req = {
                body: {
                    rid: '#1:1'
                }
            };
            const res = {
                sendStatus: sinon.spy()
            };

            const handler = addToQueue.generateHandler(db);

            const result = handler(req, res);

            expect(result).to.eventually.be.fulfilled.then(function() {
                expect(db.query.calledWith('insert into Queue (id) values (#1:1)')).to.be.true;
                expect(res.sendStatus.calledWith(200)).to.be.true;
                done();
            });
        });
    });

    describe('getQueue', function() {
        it('should have correct url', function() {
            const expectedUrl = '/queue';

            expect(getQueue.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function() {
            const db = {};

            const results = getQueue.generateHandler(db);
            expect(results).to.be.a('function');
        });

        it('should generate a handler that returns songs on queue when queue is populated', function(done) {
            const allQueue = [
                { id: '#1:1' },
                { id: '#1:2' }
            ];
            const songOnQueue = [
                { title: 'Song One', album: ['Album'], artist: ['Artist'], id: 'xxxx', '@rid': '#1:5' },
                { title: 'Song 2', album: ['Album'], artist: ['Artist'], id: 'yyyy', '@rid': '#1:1' }
            ];

            const query = sinon.stub();
            const db = {
                query: query
            };
            query.onFirstCall().returns(Promise.resolve(allQueue));
            query.onSecondCall().returns(Promise.resolve(songOnQueue));

            const req = {};
            const res = {
                send: sinon.spy()
            };

            const processedResults = [
                { title: 'Song One', id: 'xxxx', album: 'Album', artist: 'Artist', rid: '#1:5' },
                { title: 'Song 2', id: 'yyyy', album: 'Album', artist: 'Artist', rid: '#1:1' }
            ];

            const handler = getQueue.generateHandler(db);

            const result = handler(req, res);

            expect(result).to.eventually.be.fulfilled.then(function() {
                expect(query.calledWith('select * from Queue')).to.be.true;
                expect(query.calledWith(`select *, out('Found_On').title as album, out('Found_On').out('Recorded_By').name as artist from [#1:1,#1:2]`)).to.be.true;
                expect(res.send.calledWith(JSON.stringify(processedResults))).to.be.true;
                done();
            });
        });

        it('should generate a handler that returns an empty array when no queued songs', function() {
            const allQueue = [];

            const query = sinon.stub();
            const db = {
                query: query
            };
            query.onFirstCall().returns(Promise.resolve(allQueue));

            const req = {};
            const res = {
                send: sinon.spy()
            };

            const handler = getQueue.generateHandler(db);

            const result = handler(req, res);

            expect(result).to.eventually.be.fulfilled.then(function() {
                expect(query.calledWith('select * from Queue')).to.be.true;
                expect(query.neverCalledWith(`select *, out('Found_On').title as album, out('Found_On').out('Recorded_By').name as artist from []`)).to.be.true;
                expect(res.send.calledWith(JSON.stringify([]))).to.be.true;
                done();
            });
        });
    });

    describe('removeFromQueue', function () {
        it('should have the correct url', function () {
            const expectedUrl = '/queue';

            expect(removeFromQueue.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function () {
            const db = {};

            const results = removeFromQueue.generateHandler(db);
            expect(results).to.be.a('function');
        });

        it('should generate a handler that deletes from the queue based on rid', function (done) {
            const query = sinon.stub().returns(Promise.resolve());
            const db = {
                query: query
            };

            const req = {
                body: {
                    rid: '#13:1'
                }
            };
            const res = {
                sendStatus: sinon.stub()
            };

            const handler = removeFromQueue.generateHandler(db);

            const result = handler(req, res);

            expect(result).to.eventually.be.fulfilled.then(function() {
                expect(query.calledWith('delete vertex from Queue where id = :rid', {
                    params: {
                        rid: req.body.rid
                    }
                })).to.be.true;
                expect(res.sendStatus.calledWith(200)).to.be.true;
                done();
            });
        });
    });
});
