import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import {getNowPlaying} from '../../js/routes/now-playing';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Now playing route', function () {
    describe('getNowPlaying', function () {
        it('should have the correct url', function () {
            const expectedUrl = '/playing';

            expect(getNowPlaying.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function () {
            const db = {};

            const results = getNowPlaying.generateHandler(db);
            expect(results).to.be.a('function');
        });

        it('should generate a handler that returns the currently playing song', function (done) {
            const nowPlaying = [
                { title: 'Song 1', album: 'AlbumZ', artist: 'Artist', '@rid': '#1:1', '@class': 'Now_Playing'}
            ];

            const db = {
                query: sinon.stub().returns(Promise.resolve(nowPlaying))
            };

            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            const handler = getNowPlaying.generateHandler(db);
            const result = handler(req, res);

            expect(result).to.eventually.be.fulfilled.then(function() {
                expect(db.query.calledWith('select from Now_Playing limit 1')).to.be.true;
                expect(res.status.calledWith(200)).to.be.true;
                expect(res.send.calledWith(JSON.stringify({
                    title: 'Song 1',
                    album: 'AlbumZ',
                    artist: 'Artist'
                })));
                done();
            });
        });
    });
});
