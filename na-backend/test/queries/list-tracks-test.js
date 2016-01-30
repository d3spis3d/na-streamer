import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import {listArtists, listAlbums, listAlbumsByArtist} from '../../js/queries/list-tracks';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('listArtists', function() {
    it('should return select attributes from all artists', function(done) {
        const artists = [
            { '@rid': '#1:1', name: 'First', '@class': 'Artist' },
            { '@rid': '#1:2', name: 'Artist 2', '@class': 'Artist' }
        ];

        const query = sinon.stub().returns(Promise.resolve(artists));
        const db = {
            query: query
        };

        const results = listArtists(db);

        expect(results).to.eventually.be.fulfilled.then(function(artistResults) {
            expect(db.query.calledWith('select * from Artist'));
            expect(artistResults).to.eql([
                { rid: '#1:1', name: 'First' },
                { rid: '#1:2', name: 'Artist 2' }
            ]);
            done();
        });
    });
});

describe('listAlbums', function() {
    it('should return selected attributes from all albums', function(done) {
        const albums = [
            { '@rid': '#2:1', title: 'Album One', '@class': 'Album' },
            { '@rid': '#2:2', title: 'Album 2', '@class': 'Album' }
        ];

        const query = sinon.stub().returns(Promise.resolve(albums));
        const db = {
            query: query
        };

        const results = listAlbums(db);

        expect(results).to.eventually.be.fulfilled.then(function(albumResults) {
            expect(db.query.calledWith('select * from Albums'));
            expect(albumResults).to.eql([
                { rid: '#2:1', title: 'Album One' },
                { rid: '#2:2', title: 'Album 2' }
            ]);
            done();
        });
    });
});

describe('listAlbumsByArtist', function() {
    it('should return selected attributes from all albums by artist', function(done) {
        const albums = [
            { '@rid': '#2:1', title: 'Album One', '@class': 'Album' },
            { '@rid': '#2:2', title: 'Album 2', '@class': 'Album' }
        ];

        const query = sinon.stub().returns(Promise.resolve(albums));
        const db = {
            query: query
        };

        const results = listAlbumsByArtist(db, '#1:2');

        expect(results).to.eventually.be.fulfilled.then(function(albumResults) {
            expect(db.query.calledWith('select expand( in("Recorded_By") ) from #1:2'));
            expect(albumResults).to.eql([
                { rid: '#2:1', title: 'Album One' },
                { rid: '#2:2', title: 'Album 2' }
            ]);
            done();
        });
    });
});
