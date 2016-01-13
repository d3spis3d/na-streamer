import {EventEmitter} from 'events';
import uuid from 'node-uuid';

import {expect} from 'chai';
import sinon from 'sinon';

import * as serverHelper from '../../js/lib/server-helper';
import * as setupStreamHandler from '../../js/lib/setup-stream-handler';
import setupServerConnectionHandler from '../../js/lib/setup-server-connection-handler';

describe('setupServerConnectionHandler', function() {
    let tracks;
    let filesByStreamer;
    let writeToAllClients;
    let addToStreamers;
    let updateTrackListingSpy;
    let setTrackListingMap;
    let uuidSpy;
    let handlerSpy;
    let streamSpy;
    let nextSongInQueue;

    beforeEach(function() {
        tracks = {};
        filesByStreamer = sinon.spy();
        writeToAllClients = sinon.spy();
        addToStreamers = sinon.spy();
        updateTrackListingSpy = sinon.spy();
        setTrackListingMap = sinon.stub(serverHelper, 'setTrackListingMap').returns(updateTrackListingSpy);
        uuidSpy = sinon.spy(uuid, 'v4');
        handlerSpy = sinon.spy();
        streamSpy = sinon.stub(setupStreamHandler, 'default').returns(handlerSpy);
        nextSongInQueue = sinon.spy();
    });

    afterEach(function() {
        uuidSpy.restore();
        setTrackListingMap.restore();
        streamSpy.restore();
    });

    it('should return a function', function() {
        const results = setupServerConnectionHandler(tracks, filesByStreamer, writeToAllClients, addToStreamers, nextSongInQueue);

        expect(results).to.be.a('function');
    });

    it('should return a handler that generates a streamer id and creates update track listing func', function() {
        const connectionHandler = setupServerConnectionHandler(tracks, filesByStreamer, writeToAllClients, addToStreamers, nextSongInQueue);
        const streamer = new EventEmitter();

        connectionHandler(streamer);

        expect(setTrackListingMap.calledWith(tracks, filesByStreamer, uuidSpy.returnValues[0])).to.be.true;
    });

    it('should return a handler that calls setupStreamHandler on stream event', function() {
        const connectionHandler = setupServerConnectionHandler(tracks, filesByStreamer, writeToAllClients, addToStreamers, nextSongInQueue);
        const streamer = new EventEmitter();
        const mockStream = new EventEmitter();

        connectionHandler(streamer);
        streamer.emit('stream', mockStream);

        expect(streamSpy.calledWith(writeToAllClients, addToStreamers, updateTrackListingSpy, uuidSpy.returnValues[0], nextSongInQueue)).to.be.true;
        expect(handlerSpy.calledWith(mockStream)).to.be.true;
    });
});
