import path from 'path';

import {expect} from 'chai';
import sinon from 'sinon';

import createTrackResponse from '../../../js/lib/streams/create-track-response';
import * as createTrackStream from '../../../js/lib/streams/create-track-stream';

describe('CreateTrackResponse', function() {
    it('should return a function', function() {
        const filesStore = {};
        const sendFileData = function() { };

        const results = createTrackResponse(filesStore, sendFileData);

        expect(results).to.be.a('function');
    });

    it('should call create track stream and pass probe results to function', function() {
        const track = ['home', 'music', 'Artist', 'Album', '01-Song.mp3'].join(path.sep);
        const trackId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
        const filesStore = {};
        filesStore[trackId] = track;
        const sendFileData = function() { };

        const probeSpy = sinon.spy();
        const streamSpy = sinon.spy(createTrackStream, 'default');

        const streamTrack = createTrackResponse(filesStore, sendFileData, probeSpy);
        streamTrack(trackId);

        expect(streamSpy.calledWith(track, trackId, sendFileData)).to.be.true;
        expect(probeSpy.calledWith(track, sinon.match.func)).to.be.true;

        createTrackStream.default.restore();
    });
});
