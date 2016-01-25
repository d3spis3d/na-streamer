import {expect} from 'chai';
import sinon from 'sinon';

import {getArtists, getAlbums, getSongs} from '../../js/routes/library';
import * as queries from '../../js/queries/list-tracks';

describe('Library route', function() {
    describe('getArtists', function() {
        it('should have correct url', function() {
            const expectedUrl = '/artists';

            expect(getArtists.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function() {
            const db = {};

            const results = getArtists.generateHandler(db);
            expect(results).to.be.a('function');
        });

        it('should generate a handler that calls list artists query', function() {
            const artistSpy = sinon.stub(queries, 'listArtists').returns({then: function() { }});
            const db = sinon.spy();

            const handler = getArtists.generateHandler(db);
            handler(null, null);

            expect(artistSpy.calledWith(db)).to.be.true;
        });
    });

    describe('getAlbums', function () {
        it('should have correct url', function() {
            const expectedUrl = '/albums';

            expect(getAlbums.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function() {
            const db = {};

            const results = getAlbums.generateHandler(db);
            expect(results).to.be.a('function');
        });

        it('should generate a handler that calls list albums by artist with artist query', function () {
            const albumsByArtistSpy = sinon.stub(queries, 'listAlbumsByArtist').returns({then: function() { }});
            const db = sinon.spy();

            const handler = getAlbums.generateHandler(db);
            handler({
                query: {
                    artist: 'Artist'
                }
            }, null);

            expect(albumsByArtistSpy.calledWith(db, 'Artist')).to.be.true;
        });

        it('should generate a handler that calls list albums with no query', function () {
            const albumsSpy = sinon.stub(queries, 'listAlbums').returns({then: function() { }});
            const db = sinon.spy();

            const handler = getAlbums.generateHandler(db);
            handler({
                query: {}
            }, null);

            expect(albumsSpy.calledWith(db)).to.be.true;
        });
    });

    describe('getSongs', function () {
        it('should have correct url', function () {
            const expectedUrl = '/songs';

            expect(getSongs.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function () {
            const db = {};

            const results = getSongs.generateHandler(db);
            expect(results).to.be.a('function');
        });

        it('should generate a handler that calls list songs by album with album query', function () {
            const songsByAlbumSpy = sinon.stub(queries, 'listSongsByAlbum').returns({then: function() { }});
            const db = sinon.spy();

            const handler = getSongs.generateHandler(db);
            handler({
                query: {
                    album: 'Album'
                }
            }, null);

            expect(songsByAlbumSpy.calledWith(db, 'Album')).to.be.true;
        });

        it('should generate a handler that calls list songs by artist with artist query', function () {
            const songsByArtistSpy = sinon.stub(queries, 'listSongsByArtist').returns({then: function() { }});
            const db = sinon.spy();

            const handler = getSongs.generateHandler(db);
            handler({
                query: {
                    artist: 'Artist'
                }
            }, null);

            expect(songsByArtistSpy.calledWith(db, 'Artist')).to.be.true;
        });

        it('should generate a handler that calls list songs with no query', function () {
            const songsSpy = sinon.stub(queries, 'listSongs').returns({then: function() { }});
            const db = sinon.spy();

            const handler = getSongs.generateHandler(db);
            handler({
                query: {}
            }, null);

            expect(songsSpy.calledWith(db)).to.be.true;
        });
    });
});
