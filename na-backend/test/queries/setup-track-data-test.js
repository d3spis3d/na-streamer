import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import {createStreamer, createGenre, createArtist} from '../../js/queries/setup-track-data';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('createStreamer', function() {
    it('should not create streamer if already exists', function (done) {
        const key = 'xxxxxxxx';
        const db = {
            query: sinon.stub()
        };

        const queryResults = [{key: 'xxxxxxxx', '@rid': '#1:1'}];
        db.query.onFirstCall().returns(Promise.resolve(queryResults));

        const results = createStreamer(db, key);

        expect(results).to.eventually.be.fulfilled.then(function() {
            expect(db.query.callCount).to.equal(1);
            expect(db.query.calledWith('select * from Streamer where key=:key', {params: {key: key}})).to.be.true;
            done();
        });
    });

    it('should create streamer if one does not already exist', function () {
        const key = 'xxxxxxxx';
        const db = {
            query: sinon.stub()
        };

        const queryResults = [];
        db.query.onFirstCall().returns(Promise.resolve(queryResults));
        db.query.onSecondCall().returns(Promise.resolve());

        const results = createStreamer(db, key);

        expect(results).to.eventually.be.fulfilled.then(function() {
            expect(db.query.callCount).to.equal(2);
            expect(db.query.calledWith('select * from Streamer where key=:key', {params: {key: key}})).to.be.true;
            expect(db.query.calledWith('insert into Streamer (key) values (:key)', {params: {key: key}})).to.be.true;
            done();
        });
    });
});

describe('createGenre', function () {
    it('should not create genre if it already exists', function () {
        const genre = 'Genre';
        const db = {
            query: sinon.stub()
        };

        const queryResults = [{name: 'Genre', '@rid': '#1:1'}];
        db.query.onFirstCall().returns(Promise.resolve(queryResults));

        const results = createGenre(db, genre);

        expect(results).to.eventually.be.fulfilled.then(function() {
            expect(db.query.callCount).to.equal(1);
            expect(db.query.calledWith('select * from Genre where name=:name', {params: {name: genre}})).to.be.true;
            done();
        });
    });

    it('should create genre if it doesnt exist', function () {
        const genre = 'Genre';
        const db = {
            query: sinon.stub()
        };

        const queryResults = [];
        db.query.onFirstCall().returns(Promise.resolve(queryResults));
        db.query.onSecondCall().returns(Promise.resolve());

        const results = createGenre(db, genre);

        expect(results).to.eventually.be.fulfilled.then(function() {
            expect(db.query.callCount).to.equal(2);
            expect(db.query.calledWith('select * from Genre where name=:name', {params: {name: genre}})).to.be.true;
            expect(db.query.calledWith('insert into Genre (name) values :name', {params: {name: genre}})).to.be.true;
            done();
        });
    });
});

describe('createArtist', function () {
    it('should not create artist if already exists', function () {
        const artist = 'Artist';
        const genre = 'Genre';
        const db = {
            query: sinon.stub()
        };

        const queryResults = [{name: 'Artist', '@rid': '#1:1'}];
        db.query.onFirstCall().returns(Promise.resolve(queryResults));

        const results = createArtist(db, artist, genre);

        expect(results).to.eventually.be.fulfilled.then(function() {
            expect(db.query.callCount).to.equal(1);
            expect(db.query.calledWith('select * from Artist where name=:name', {params: {name: artist}}));
            done();
        });
    });

    it('should create artist and edge to genre if artist doesnt exist', function() {
        const artist = 'Artist';
        const genre = 'Genre';
        const db = {
            query: sinon.stub(),
            let: sinon.stub().returnsThis(),
            commit: sinon.stub().returnsThis(),
            'return': sinon.stub().returnsThis(),
            all: sinon.stub()
        };

        const queryResults = [];
        db.query.onFirstCall().returns(Promise.resolve(queryResults));

        const results = createArtist(db, artist, genre);

        expect(results).to.eventually.be.fulfilled.then(function() {
            expect(db.query.callCount).to.equal(1);
            expect(db.query.calledWith('select * from Artist where name=:name', {params: {name: artist}}));
            expect(db.let.callCount).to.equal(3);
            expect(db.let.calledWith('firstVertex', sinon.match.func)).to.be.true;
            expect(db.let.calledWith('secondVertex', sinon.match.func)).to.be.true;
            expect(db.let.calledWith('joiningEdge', sinon.match.func)).to.be.true;
            expect(db.commit.called).to.be.true;
            expect(db.return.calledWith('$firstVertex')).to.be.true;
            expect(db.all.called).to.be.true;
            done();
        });
    });
});
