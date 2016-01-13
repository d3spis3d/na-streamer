import {EventEmitter} from 'events';
import binaryjs from 'binaryjs';

import {expect} from 'chai';
import sinon from 'sinon';

import * as serverHelpers from '../../js/lib/server-helper';
import * as setupServerConnectionHandler from '../../js/lib/setup-server-connection-handler';
import setupStreamServer from '../../js/lib/setup-stream-server';

describe('setupStreamServer', function() {
    let mockServer;
    let binaryServerSpy;
    let writeToAllClients;
    let setClientListSpy;
    let addToStreamers;
    let createStreamersUpdateSpy;
    let handler;
    let setupConnectionSpy;
    let nextSongInQueue;

    let streamers;
    let tracks;
    let filesByStreamer;
    let clients;

    beforeEach(function() {
        mockServer = new EventEmitter();
        binaryServerSpy = sinon.stub(binaryjs, 'BinaryServer').returns(mockServer);
        writeToAllClients = sinon.spy();
        setClientListSpy = sinon.stub(serverHelpers, 'setClientList').returns(writeToAllClients);
        addToStreamers = sinon.spy();
        createStreamersUpdateSpy = sinon.stub(serverHelpers, 'createStreamersUpdate').returns(addToStreamers);
        handler = sinon.spy();
        setupConnectionSpy = sinon.stub(setupServerConnectionHandler, 'default').returns(handler);
        nextSongInQueue = sinon.spy();

        streamers = {};
        tracks = {};
        filesByStreamer = {};
        clients = [];
    });

    afterEach(function() {
        binaryServerSpy.restore();
        setClientListSpy.restore();
        createStreamersUpdateSpy.restore();
        setupConnectionSpy.restore();
    });

    it('should create binaryjs server', function() {
        setupStreamServer(streamers, tracks, filesByStreamer, clients);
        const expectedArgs = {port: 9000};

        expect(binaryServerSpy.calledWith(expectedArgs));
    });

    it('should create functions for files, streams, clients and setup connection handler', function() {
        setupStreamServer(streamers, tracks, filesByStreamer, clients, nextSongInQueue);
        const mockStream = {};

        mockServer.emit('connection', mockStream);

        expect(setClientListSpy.calledWith(clients)).to.be.true;
        expect(createStreamersUpdateSpy.calledWith(streamers)).to.be.true;
        expect(setupConnectionSpy.calledWith(tracks, filesByStreamer, writeToAllClients, addToStreamers, nextSongInQueue)).to.be.true;
        expect(handler.calledWith(mockStream)).to.be.true;
    });
});
