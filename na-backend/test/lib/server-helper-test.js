import {expect} from 'chai';
import sinon from 'sinon';

import {setupTrackListUpdate, setupInitQueue, setupNextSong} from '../../js/lib/server-helper';

describe('setupTrackListUpdate', function() {
    it('should return a function', function() {
        const db = sinon.spy();

        const results = setupTrackListUpdate(db);

        expect(results).to.be.a('function');
    });
});

describe('setupInitQueue', function() {
    it('should return a function', function() {
        const songQueue = [];
        const filesByStreamer = {};
        const streamers = {};

        const results = setupInitQueue(songQueue, filesByStreamer, streamers);

        expect(results).to.be.a('function');
    });
});

describe('setupNextSong', function() {
    it('should return a function', function () {
        const songQueue = [];
        const filesByStreamer = {};
        const streamers = {};

        const results = setupNextSong(songQueue, filesByStreamer, streamers);

        expect(results).to.be.a('function');
    });
});
