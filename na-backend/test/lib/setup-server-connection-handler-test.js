import {EventEmitter} from 'events';
import uuid from 'node-uuid';

import {expect} from 'chai';
import sinon from 'sinon';

import * as serverHelper from '../../js/lib/server-helper';
import * as setupStreamHandler from '../../js/lib/setup-stream-handler';
import setupServerConnectionHandler from '../../js/lib/setup-server-connection-handler';

describe('setupServerConnectionHandler', function() {
    let writeToAllClients;
    let addToStreamers;
    let updateTrackListingSpy;
    let setTrackListingMap;
    let handlerSpy;
    let streamSpy;
    let nextSongInQueue;
    let db

    beforeEach(function() {
        writeToAllClients = sinon.spy();
        addToStreamers = sinon.spy();
        updateTrackListingSpy = sinon.spy();
        setTrackListingMap = sinon.stub(serverHelper, 'setTrackListingMap').returns(updateTrackListingSpy);
        handlerSpy = sinon.spy();
        streamSpy = sinon.stub(setupStreamHandler, 'default').returns(handlerSpy);
        nextSongInQueue = sinon.spy();
        db = sinon.spy();
    });

    afterEach(function() {
        setTrackListingMap.restore();
        streamSpy.restore();
    });

    it('should return a function', function() {
        const results = setupServerConnectionHandler(writeToAllClients, addToStreamers, nextSongInQueue, db);

        expect(results).to.be.a('function');
    });

    it('should return a handler creates update track listing func', function() {
        const connectionHandler = setupServerConnectionHandler(writeToAllClients, addToStreamers, nextSongInQueue, db);
        const streamer = new EventEmitter();

        connectionHandler(streamer);

        expect(setTrackListingMap.calledWith(db)).to.be.true;
    });

    it('should return a handler that calls setupStreamHandler on stream event', function() {
        const connectionHandler = setupServerConnectionHandler(writeToAllClients, addToStreamers, nextSongInQueue, db);
        const streamer = new EventEmitter();
        const mockStream = new EventEmitter();

        connectionHandler(streamer);
        streamer.emit('stream', mockStream);

        expect(streamSpy.calledWith(writeToAllClients, addToStreamers, updateTrackListingSpy, nextSongInQueue)).to.be.true;
        expect(handlerSpy.calledWith(mockStream)).to.be.true;
    });
});
