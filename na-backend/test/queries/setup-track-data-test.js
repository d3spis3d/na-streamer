import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import {createStreamer, createGenre, createArtist,
        createAlbum} from '../../js/queries/setup-track-data';

chai.use(chaiAsPromised);
const expect = chai.expect;

let db;

describe('createStreamer', function() {
    describe('with no existing streamer', function() {
        beforeEach(function() {
            const query = sinon.stub();
            query.onFirstCall().returns(Promise.resolve([]))
            query.onSecondCall().returns(Promise.resolve(true));

            db = {
                query: query
            };
        });

        it('creates streamer', function(done) {
            const result = createStreamer(db, 'abcd');

            expect(result).to.eventually.be.fulfilled.then(function(createdStreamer) {
                expect(createdStreamer).to.equal(true);
                sinon.assert.callCount(db.query, 2);
                sinon.assert.calledWith(db.query, 'select * from Streamer where key=:key', {params: {key: 'abcd'}});
                sinon.assert.calledWith(db.query, 'insert into Streamer (key) values (:key)', {params: {key: 'abcd'}});
                done();
            });
        });
    });

    describe('with existing streamer', function() {
        beforeEach(function() {
            const query = sinon.stub();
            query.onFirstCall().returns(Promise.resolve(['abcd']))

            db = {
                query: query
            };
        });

        it('doesnt create streamer', function(done) {
            const result = createStreamer(db, 'abcd');

            expect(result).to.eventually.be.fulfilled.then(function(createdStreamer) {
                expect(createdStreamer).to.equal(null);
                sinon.assert.callCount(db.query, 1);
                sinon.assert.calledWith(db.query, 'select * from Streamer where key=:key', {params: {key: 'abcd'}});
                done();
            });
        });
    });
});

describe('createGenre', function() {
    describe('with no existing genre', function() {
        beforeEach(function() {
            const query = sinon.stub();
            query.onFirstCall().returns(Promise.resolve([]))
            query.onSecondCall().returns(Promise.resolve(true));

            db = {
                query: query
            };
        });

        it('creates the genre', function() {
            const result = createGenre(db, 'Folk');

            expect(result).to.eventually.be.fulfilled.then(function(createdGenre) {
                expect(createdGenre).to.equal(true);
                sinon.assert.callCount(db.query, 2);
                sinon.assert.calledWith(db.query, 'select * from Genre where name=:name', {params: {name: 'Folk'}});
                sinon.assert.calledWith(db.query, 'insert into Genre (name) values (:name)', {params: {name: 'Folk'}});
                done();
            });
        });
    });

    describe('with existing genre', function() {
        beforeEach(function() {
            const query = sinon.stub();
            query.onFirstCall().returns(Promise.resolve(['Folk']))

            db = {
                query: query
            };
        });

        it('doesnt create the genre', function() {
            const result = createGenre(db, 'Folk');

            expect(result).to.eventually.be.fulfilled.then(function(createdGenre) {
                expect(createdGenre).to.equal(null);
                sinon.assert.callCount(db.query, 1);
                sinon.assert.calledWith(db.query, 'select * from Genre where name=:name', {params: {name: 'Folk'}});
                done();
            });
        });
    });
});

describe('createArtist', function() {
    describe('with no existing artist', function() {
        beforeEach(function() {
            const query = sinon.stub();
            query.onFirstCall().returns(Promise.resolve([]))
            query.onSecondCall().returns(Promise.resolve(true));

            db = {
                query: query
            };
        });

        it('creates artist', function() {
            const result = createArtist(db, 'Daniel');

            expect(result).to.eventually.be.fulfilled.then(function(createdArtist) {
                expect(createdArtist).to.equal(true);
                sinon.assert.callCount(db.query, 2);
                sinon.assert.calledWith(db.query, 'select * from Artist where name=:name', {params: {name: 'Daniel'}});
                sinon.assert.calledWith(db.query, 'insert into Artist (name) values (:name)', {params: {name: 'Daniel'}});
                done();
            });
        });
    });

    describe('with existing artist', function() {
        beforeEach(function() {
            const query = sinon.stub();
            query.onFirstCall().returns(Promise.resolve(['Daniel']))

            db = {
                query: query
            };
        });

        it('doesnt create artist', function() {
            const result = createArtist(db, 'Daniel');

            expect(result).to.eventually.be.fulfilled.then(function(createdArtist) {
                expect(createdArtist).to.equal(null);
                sinon.assert.callCount(db.query, 1);
                sinon.assert.calledWith(db.query, 'select * from Artist where name=:name', {params: {name: 'Daniel'}});
                done();
            });
        });
    });
});

describe('createAlbum', function() {
    describe('with no existing album', function() {
        beforeEach(function() {
            const query = sinon.stub();
            query.onFirstCall().returns(Promise.resolve([]))
            query.onSecondCall().returns(Promise.resolve(true));

            db = {
                query: query
            };
        });

        it('creates album', function() {
            const result = createAlbum(db, 'Album One');

            expect(result).to.eventually.be.fulfilled.then(function(createdAlbum) {
                expect(createdAlbum).to.equal(true);
                sinon.assert.callCount(db.query, 2);
                sinon.assert.calledWith(db.query, 'select * from Album where title=:title', {params: {title: 'Album One'}});
                sinon.assert.calledWith(db.query, 'insert into Album (title) values (:title)', {params: {title: 'Album One'}});
                done();
            });
        });
    });

    describe('with existing album', function() {
        beforeEach(function() {
            const query = sinon.stub();
            query.onFirstCall().returns(Promise.resolve(['Album One']))

            db = {
                query: query
            };
        });

        it('doesnt create album', function() {
            const result = createAlbum(db, 'Album One');

            expect(result).to.eventually.be.fulfilled.then(function(createdAlbum) {
                expect(createdAlbum).to.equal(null);
                sinon.assert.callCount(db.query, 1);
                sinon.assert.calledWith(db.query, 'select * from Album where title=:title', {params: {title: 'Album One'}});
                done();
            });
        });
    });
});
