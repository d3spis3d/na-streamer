import path from 'path';
import {EventEmitter} from 'events';

import {expect} from 'chai';
import sinon from 'sinon';

import createTrackStream from '../../../js/lib/streams/create-track-stream';

describe('createTrackStream', function() {

    it('should return a function', function() {
        const track = ['home', 'music', 'Artist', 'Album', '01-Song.mp3'].join(path.sep);
        const trackId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
        const sendFileData = function() { };

        const results = createTrackStream(track, trackId, sendFileData);

        expect(results).to.be.a('function');
    });

    it('should return a function that creates throttled stream and sends file data', function() {
        const err = null;
        const input = {
            format: {
                bit_rate: 100
            }
        };
        const track = ['home', 'music', 'Artist', 'Album', '01-Song.mp3'].join(path.sep);
        const trackId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
        const mockData = 'mock data';

        const sendFileData = sinon.spy();
        const throttleStream = new EventEmitter();
        const throttleSpy = sinon.stub().returns(throttleStream);

        const streamTrack = createTrackStream(track, trackId, sendFileData, throttleSpy);

        streamTrack(err, input);

        throttleStream.emit('data', mockData);

        expect(throttleSpy.calledWithNew()).to.be.true;
        expect(throttleSpy.calledWith({
            bps: 14,
            chunkSize: 5
        })).to.be.true;

        expect(sendFileData.calledWith(mockData));
    });

    it('should return a function that send track id on data stream end', function() {
        const err = null;
        const input = {
            format: {
                bit_rate: 100
            }
        };
        const track = ['home', 'music', 'Artist', 'Album', '01-Song.mp3'].join(path.sep);
        const trackId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
        const mockData = 'mock data';

        const sendFileData = sinon.spy();
        const throttleStream = new EventEmitter();
        const throttleSpy = sinon.stub().returns(throttleStream);

        const streamTrack = createTrackStream(track, trackId, sendFileData, throttleSpy);

        streamTrack(err, input);

        throttleStream.emit('end');

        expect(throttleSpy.calledWithNew()).to.be.true;
        expect(throttleSpy.calledWith({
            bps: 14,
            chunkSize: 5
        })).to.be.true;

        expect(sendFileData.calledWith(trackId));
    });
});
