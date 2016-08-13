import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import nowPlayingQuery from '../../js/queries/now-playing';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Now playing query', function() {
    it('should retrieve now playing list for channel', function (done) {
        const playingList = [{
            title: 'Song1',
            album: 'Album One',
            artist: 'Artist Zero',
            '@rid': '#1:1'
        }];
        const db = {
            query: sinon.stub().returns(Promise.resolve(playingList))
        };

        const results = nowPlayingQuery(db, 'abcd');

        expect(results).to.eventually.be.fulfilled.then(function(playing) {
            sinon.assert.calledWith(db.query, 'select from Now_Playing where channel = :channel limit 1', {
                params: {
                    channel: 'abcd'
                }
            });
            expect(playing).to.eql({
                title: 'Song1',
                album: 'Album One',
                artist: 'Artist Zero'
            })
            done();
        });
    });
});
