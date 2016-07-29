import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import {getArtists, getAlbums, getSongs} from '../../js/routes/library';
import * as queries from '../../js/queries/list-tracks';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Library route', function() {
    describe('getArtists', function() {
        it('should have correct url', function() {
            const expectedUrl = '/api/artists';

            expect(getArtists.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function() {
            const db = {};

            const results = getArtists.generateHandler(db);
            expect(results).to.be.a('function');
        });

        it('should generate a handler that calls list artists query', function(done) {
            const artists = [
                { name: 'Artist One' },
                { name: 'A Artist' }
            ];

            const artistSpy = sinon.stub(queries, 'listArtists').returns(Promise.resolve(artists));
            const db = sinon.spy();

            const res = {
                send: sinon.spy()
            };

            const handler = getArtists.generateHandler(db);
            const results = handler(null, res);

            expect(results).to.eventually.be.fulfilled.then(function() {
                expect(artistSpy.calledWith(db)).to.be.true;
                expect(res.send.calledWith(JSON.stringify(artists))).to.be.true;
                done();
            });
        });
    });

    describe('getAlbums', function () {
        it('should have correct url', function() {
            const expectedUrl = '/api/albums';

            expect(getAlbums.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function() {
            const db = {};

            const results = getAlbums.generateHandler(db);
            expect(results).to.be.a('function');
        });

        it('should generate a handler that calls list albums by artist with artist query', function (done) {
            const albums = [
                { title: 'Album Z' }
            ];

            const albumsByArtistSpy = sinon.stub(queries, 'listAlbumsByArtist').returns(Promise.resolve(albums));
            const db = sinon.spy();

            const req = {
                query: {
                    artist: 'Artist'
                }
            };
            const res = {
                send: sinon.spy()
            };

            const handler = getAlbums.generateHandler(db);
            const results = handler(req, res);

            expect(results).to.eventually.be.fulfilled.then(function() {
                expect(albumsByArtistSpy.calledWith(db, 'Artist')).to.be.true;
                expect(res.send.calledWith(JSON.stringify(albums))).to.be.true;
                done();
            });
        });

        it('should generate a handler that calls list albums with no query', function (done) {
            const albums = [
                { title: 'Album Z' }
            ];

            const albumsSpy = sinon.stub(queries, 'listAlbums').returns(Promise.resolve(albums));
            const db = sinon.spy();

            const req = {
                query: {}
            };
            const res = {
                send: sinon.spy()
            };

            const handler = getAlbums.generateHandler(db);
            const results = handler(req, res);

            expect(results).to.eventually.be.fulfilled.then(function() {
                expect(albumsSpy.calledWith(db)).to.be.true;
                expect(res.send.calledWith(JSON.stringify(albums))).to.be.true;
                done();
            });
        });
    });

    describe('getSongs', function () {
        it('should have correct url', function () {
            const expectedUrl = '/api/songs';

            expect(getSongs.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function () {
            const db = {};

            const results = getSongs.generateHandler(db);
            expect(results).to.be.a('function');
        });

        it('should generate a handler that calls list songs by album with album query', function (done) {
            const songs = [
                { title: 'Song One', number: '2' }
            ];

            const songsByAlbumSpy = sinon.stub(queries, 'listSongsByAlbum').returns(Promise.resolve(songs));
            const db = sinon.spy();

            const req = {
                query: {
                    album: 'Album'
                }
            };
            const res = {
                send: sinon.spy()
            };

            const handler = getSongs.generateHandler(db);
            const results = handler(req, res);

            expect(results).to.eventually.be.fulfilled.then(function() {
                expect(songsByAlbumSpy.calledWith(db, 'Album')).to.be.true;
                expect(res.send.calledWith(JSON.stringify(songs))).to.be.true;
                done();
            });
        });

        it('should generate a handler that calls list songs by artist with artist query', function (done) {
            const songs = [
                { title: 'Song One', number: '2' }
            ];

            const songsByArtistSpy = sinon.stub(queries, 'listSongsByArtist').returns(Promise.resolve(songs));
            const db = sinon.spy();

            const req = {
                query: {
                    artist: 'Artist'
                }
            };
            const res = {
                send: sinon.spy()
            };

            const handler = getSongs.generateHandler(db);
            const results = handler(req, res);

            expect(results).to.eventually.be.fulfilled.then(function() {
                expect(songsByArtistSpy.calledWith(db, 'Artist')).to.be.true;
                expect(res.send.calledWith(JSON.stringify(songs))).to.be.true;
                done();
            });
        });

        it('should generate a handler that calls list songs with no query', function (done) {
            const songs = [
                { title: 'Song One', number: '2' }
            ];

            const songsSpy = sinon.stub(queries, 'listSongs').returns(Promise.resolve(songs));
            const db = sinon.spy();

            const req = {
                query: {}
            };
            const res = {
                send: sinon.spy()
            };

            const handler = getSongs.generateHandler(db);
            const results = handler(req, res);

            expect(results).to.eventually.be.fulfilled.then(function() {
                expect(songsSpy.calledWith(db)).to.be.true;
                expect(res.send.calledWith(JSON.stringify(songs))).to.be.true;
                done();
            });
        });
    });
});
