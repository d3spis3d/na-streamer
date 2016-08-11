import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import {listChannels, createChannelQuery, deleteChannelQuery} from '../../js/queries/channel';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('listChannels', function () {
    it('should return a list of channels', function (done) {
        const channelList = [{'@rid': '#1:1', key: 'abcd', title: 'Default'}];
        const db = {
            query: sinon.stub().returns(Promise.resolve(channelList))
        };

        const results = listChannels(db);
        expect(results).to.eventually.be.fulfilled.then(function(resultsList) {
            expect(resultsList).to.eql([{key: 'abcd', title: 'Default'}]);
            sinon.assert.calledWith(db.query, 'select * from Channel');
            done();
        });
    });
});

describe('createChannelQuery', function() {
    it('should create a new channel with key and title', function (done) {
        const db = {
            query: sinon.stub().returns(Promise.resolve())
        };

        const results = createChannelQuery(db, 'Default', 'abcd');
        expect(results).to.eventually.be.fulfilled.then(function () {
            sinon.assert.calledWith(db.query, 'insert into Channel (title, key) values (Default, abcd)');
            done();
        });
    });
});

describe('deleteChannelQuery', function() {
    it('should delete a channel by key', function (done) {
        const db = {
            query: sinon.stub().returns(Promise.resolve())
        };

        const results = deleteChannelQuery(db, 'abcd');
        expect(results).to.eventually.be.fulfilled.then(function () {
            sinon.assert.calledWith(db.query, 'delete vertex from Channel where key = :key', {params: {key: 'abcd'}});
            done();
        });
    });
});
