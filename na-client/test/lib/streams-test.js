import {createStreamToServer, openStreamToServer,
        createTrackRequestResponse, createTrackStream} from '../../js/lib/streams';

import * as files from '../../js/lib/files';

import {EventEmitter} from 'events';
import path from 'path';

import {expect} from 'chai';
import sinon from 'sinon';
import probe from 'node-ffprobe';
import Throttle from 'throttle';

describe('Streams function', function() {
    describe('createStreamToServer', function() {
        it('should return a function', function() {
            const input = {};

            const results = createStreamToServer(input);

            expect(results).to.be.a('function');
        });

        it('should create a function that writes to stream', function() {
            const stream = {
                write: function() { }
            };
            const spy = sinon.spy(stream, 'write');
            const inputData = { key: 'value' };

            const func = createStreamToServer(stream);
            func(inputData);

            expect(spy.calledWith(inputData)).to.be.true;
        });
    });

    describe('createTrackRequestResponse', function() {
        it('should return a function', function() {
            const filesStore = {};
            const sendFileData = function() { };

            const results = createTrackRequestResponse(filesStore, sendFileData);

            expect(results).to.be.a('function');
        });

        it('should call create track stream and pass probe results to function', function() {
            const track = ['home', 'music', 'Artist', 'Album', '01-Song.mp3'].join(path.sep);
            const trackId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
            const filesStore = {};
            filesStore[trackId] = track;
            const sendFileData = function() { };

            const probeSpy = sinon.spy(probe);
            const streamSpy = sinon.spy(createTrackStream);

            const streamTrack = createTrackRequestResponse(filesStore, sendFileData);
            streamTrack(trackId);

            expect(streamSpy.calledWith(track, trackId, sendFileData));
            expect(probeSpy.calledWith(track, sinon.match.func));
        });
    });

    describe('createTrackStream', function() {
        it('should return a function', function() {
            const track = ['home', 'music', 'Artist', 'Album', '01-Song.mp3'].join(path.sep);
            const trackId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
            const sendFileData = function() { };

            const results = createTrackStream(track, trackId, sendFileData);

            expect(results).to.be.a('function');
        });

        it('should return a function that creates throttled stream', function() {
            const err = null;
            const input = {
                format: {
                    bit_rate: 100
                }
            };
            const track = ['home', 'music', 'Artist', 'Album', '01-Song.mp3'].join(path.sep);
            const trackId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
            const sendFileData = function() { };

            const throttleSpy = sinon.spy(Throttle);

            const streamTrack = createTrackStream(track, trackId, sendFileData);

            streamTrack(err, input);

            expect(throttleSpy.calledWith({
                bps: 14,
                chunkSize: 5
            }));
        });
    });

    describe('openStreamToServer', function() {
        it('should create a stream from the client and start file processing', function() {
            const filesStore = {};
            const musicDir = ['home', 'testing', 'music'].join(path.sep);
            const client = {
                createStream: function() { }
            };

            const clientSpy = sinon.stub(client, 'createStream').returns(new EventEmitter());
            const filesSpy = sinon.stub(files, 'setupFilesProcessing');

            const results = openStreamToServer(filesStore, musicDir, client);

            expect(clientSpy.called);
            expect(filesSpy.calledWith(filesStore, sinon.match.func, musicDir));
        });
    });
});
