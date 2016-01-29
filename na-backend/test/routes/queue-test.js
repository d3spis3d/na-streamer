import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon'

import {addToQueue} from '../../js/routes/queue';

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
});
