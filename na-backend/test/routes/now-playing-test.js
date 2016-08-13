import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import {getNowPlaying} from '../../js/routes/now-playing';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Now playing route', function () {
    describe('getNowPlaying', function () {
        it('should have the correct url', function () {
            const expectedUrl = '/api/playing/:channel';

            expect(getNowPlaying.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function () {
            const db = {};

            const results = getNowPlaying.generateHandler(db);
            expect(results).to.be.a('function');
        });

        it('should generate a handler that returns the currently playing song', function (done) {
            const nowPlaying = { title: 'Song 1', album: 'AlbumZ', artist: 'Artist'};

            const db = sinon.stub();
            const nowPlayingQuery = sinon.stub().returns(Promise.resolve(nowPlaying));

            const req = {
                params: {channel: 'abcd'}
            };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            const handler = getNowPlaying.generateHandler(db, nowPlayingQuery);
            const result = handler(req, res);

            expect(result).to.eventually.be.fulfilled.then(function() {
                sinon.assert.calledWith(nowPlayingQuery, db, 'abcd');
                sinon.assert.calledWith(res.status, 200);
                sinon.assert.calledWith(res.send, JSON.stringify({
                    title: 'Song 1',
                    album: 'AlbumZ',
                    artist: 'Artist'
                }));
                done();
            });
        });
    });
});
