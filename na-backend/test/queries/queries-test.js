import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import {listQueueForChannel, addToChannelQueue, removeFromChannelQueue} from '../../js/queries/queue';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('listQueueForChannel', function() {
    describe('with songs in the queue', function() {
        it('returns list of songs', function(done) {
            const queueResults = [
                {id: '#1:1'},
                {id: '#1:2'}
            ];
            const songResults = [
                {title: 'Song1', id: 'abcdef', album: ['Album1'], artist: ['Artist1'], '@rid': '#2:1'},
                {title: 'SongA', id: 'xyzwuv', album: ['Album0'], artist: ['ArtistX'], '@rid': '#2:2'}
            ];

            const query = sinon.stub();
            query.onCall(0).returns(Promise.resolve(queueResults));
            query.onCall(1).returns(Promise.resolve(songResults));
            const db = {
                query: query
            };

            const results = listQueueForChannel(db, 'channel1');
            expect(results).to.eventually.be.fulfilled.then(function(processedSongs) {
                sinon.assert.callCount(db.query, 2);
                sinon.assert.calledWith(db.query, 'select * from Queue where channel = :channel', {
                    params: {
                        channel: 'channel1'
                    }
                });
                sinon.assert.calledWith(db.query, `select *, out('Found_On').title as album, out('Found_On').out('Recorded_By').name as artist from [#1:1,#1:2]`);
                expect(processedSongs).to.eql([
                    {title: 'Song1', id: 'abcdef', album: 'Album1', artist: 'Artist1', rid: '#2:1'},
                    {title: 'SongA', id: 'xyzwuv', album: 'Album0', artist: 'ArtistX', rid: '#2:2'}
                ]);
                done();
            });
        });
    });

    describe('with no songs in the queue', function() {
        it('returns an empty array', function(done) {
            const queueResults = [];

            const query = sinon.stub();
            query.onCall(0).returns(Promise.resolve(queueResults));
            const db = {
                query: query
            };

            const results = listQueueForChannel(db, 'channel1');
            expect(results).to.eventually.be.fulfilled.then(function(processedSongs) {
                sinon.assert.callCount(db.query, 1);
                sinon.assert.calledWith(db.query, 'select * from Queue where channel = :channel', {
                    params: {
                        channel: 'channel1'
                    }
                });
                expect(processedSongs).to.eql([]);
                done();
            });
        });
    });
});

describe('addToChannelQueue', function () {
    it('runs insert query', function() {
        const queryResults = sinon.stub();
        const db = {
            query: sinon.stub().returns(queryResults)
        };

        const results = addToChannelQueue(db, '#1:1', 'abcd');
        sinon.assert.calledWith(db.query, `insert into Queue (id, channel) values (#1:1, abcd)`);
        expect(results).to.equal(queryResults);
    });
});

describe('removeFromChannelQueue', function () {
    it('runs delete query', function () {
        const queryResults = sinon.stub();
        const db = {
            query: sinon.stub().returns(queryResults)
        };

        const results = removeFromChannelQueue(db, '#1:1', 'abcd');
        sinon.assert.calledWith(db.query, 'delete vertex from Queue where id = :rid and channel = :channel', {
            params: {
                rid: '#1:1',
                channel: 'abcd'
            }
        });
        expect(results).to.equal(queryResults);
    });
});
