import uuid from 'node-uuid';
import fs from 'fs';
import {EventEmitter} from 'events';

import {expect} from 'chai';
import path from 'path';
import sinon from 'sinon';

import {buildFileInfoForBackend} from '../../../js/lib/files/files-parsing';
import {setupFilePathProcessor, setupFileWatcher} from '../../../js/lib/files/files-processing';

describe('setupFilePathProcessor', function() {
    let sendFileData;
    let processTracks;
    let musicDir;
    let uuidSpy;

    const mockHostedTracks = {
        'Artist': {
            'Album': {
                '01': {
                    title: 'Song Title',
                    id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx'
                }
            }
        }
    };

    beforeEach(function() {
        sendFileData = sinon.spy();
        processTracks = sinon.stub().returns(mockHostedTracks);
        musicDir = ['home', 'music'].join(path.sep);
        uuidSpy = sinon.stub(uuid, 'v4').returns('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx');
    });

    afterEach(function() {
        uuid.v4.restore();
        sendFileData = null;
        processTracks = null;
    });

    it('should return a function', function() {
        const results = setupFilePathProcessor(sendFileData, processTracks, musicDir);

        expect(results).to.be.a('function');
    });

    it('should create processor that does not send data on err', function() {
        const processFiles = setupFilePathProcessor(sendFileData, processTracks, musicDir);

        processFiles('Error', []);

        expect(sendFileData.called).to.be.false;
        expect(processTracks.called).to.be.false;
    });

    it('should create processor that processes files and sends data', function() {
        const processFiles = setupFilePathProcessor(sendFileData, processTracks, musicDir);
        const files = [['home', 'music', 'Artist', 'Album', '01-Song Title.mp3'].join(path.sep)];

        processFiles(null, files);

        const expectedTracks = [{
            artist: 'Artist',
            album: 'Album',
            file: ['home', 'music', 'Artist', 'Album', '01-Song Title.mp3'].join(path.sep),
            number: '01',
            title: 'Song Title',
            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx'
        }];

        expect(processTracks.calledWith(expectedTracks, sinon.match.func, {})).to.be.true;
        expect(sendFileData.calledWith(mockHostedTracks)).to.be.true;
    })
});

describe('setupFileWatcher', function() {
    let sendFileData;
    let processTracks;
    let musicDir;
    let uuidSpy;

    const mockHostedTracks = {
        'Artist': {
            'Album': {
                '01': {
                    title: 'Song Title',
                    id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx'
                },
                '02': {
                    title: 'Song Two',
                    id: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyy'
                }
            }
        }
    };

    beforeEach(function() {
        sendFileData = sinon.spy();
        processTracks = sinon.stub().returns(mockHostedTracks);
        musicDir = ['home', 'music'].join(path.sep);
        uuidSpy = sinon.spy(uuid, 'v4');
    });

    afterEach(function() {
        uuid.v4.restore();
    });

    it('should return a function', function() {
        const results = setupFileWatcher(sendFileData, processTracks, musicDir);

        expect(results).to.be.a('function');
    });

    it('should create watcher that handles created event', function(done) {
        this.timeout(20000);

        const fileWatchHandler = setupFileWatcher(sendFileData, processTracks, musicDir);

        const monitor = new EventEmitter();
        const lstatSpy = sinon.stub(fs, 'lstatSync').returns({
            isFile: () => true
        });

        fileWatchHandler(monitor);

        monitor.emit('created', ['home', 'music', 'Artist', 'Album', '01-Song Title.mp3'].join(path.sep));
        monitor.emit('created', ['home', 'music', 'Artist', 'Album', '02-Song Two.mp3'].join(path.sep));

        setTimeout(function() {
            const expectedTracks = [
                {artist: 'Artist', album: 'Album', number: '01', title: 'Song Title', id: uuidSpy.returnValues[0], file: ['home', 'music', 'Artist', 'Album', '01-Song Title.mp3'].join(path.sep)},
                {artist: 'Artist', album: 'Album', number: '02', title: 'Song Two', id: uuidSpy.returnValues[1], file: ['home', 'music', 'Artist', 'Album', '02-Song Two.mp3'].join(path.sep)}
            ];

            expect(processTracks.args[0][0]).to.eql(expectedTracks);
            expect(processTracks.calledWith(expectedTracks, buildFileInfoForBackend, {})).to.be.true;
            expect(sendFileData.calledWith(mockHostedTracks)).to.be.true;
            done();
        }, 10500);
    });
});
