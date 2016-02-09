import fs from 'fs';
import crypto from 'crypto';
import {EventEmitter} from 'events';

import {expect} from 'chai';
import path from 'path';
import sinon from 'sinon';

import {setupFilePathProcessor, setupFileWatcher} from '../../../js/lib/files/files-processing';

describe('setupFilePathProcessor', function() {
    let sendFileData;
    let musicDir;
    let filesStore;
    let updateHash;
    let digestHash;
    let hash;

    const key = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    const mockHostedTracks = {
        'Genre': {
            'Artist': {
                'Album': {
                    '01': {
                        title: 'Song Title',
                        id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                    }
                }
            }
        }
    };


    beforeEach(function() {
        sendFileData = sinon.spy();
        filesStore = {};
        musicDir = ['home', 'music'].join(path.sep);
        digestHash = {
            digest: sinon.stub().returns('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
        };
        updateHash = {
            update: sinon.stub().returns(digestHash)
        };
        hash = sinon.stub(crypto, 'createHash').returns(updateHash);
    });

    afterEach(function() {
        sendFileData = null;
        crypto.createHash.restore();
    });

    it('should return a function', function() {
        const results = setupFilePathProcessor(sendFileData, filesStore, musicDir, key);

        expect(results).to.be.a('function');
    });

    it('should create processor that does not send data on err', function() {
        const processFiles = setupFilePathProcessor(sendFileData, filesStore, musicDir, key);

        processFiles('Error', []);

        expect(sendFileData.called).to.be.false;
    });

    it('should create processor that processes files and sends data', function() {
        const processFiles = setupFilePathProcessor(sendFileData, filesStore, musicDir, key);
        const files = [['home', 'music', 'Genre', 'Artist', 'Album', '01-Song Title.mp3'].join(path.sep)];

        processFiles(null, files);

        const expectedTracks = [{
            genre: 'Genre',
            artist: 'Artist',
            album: 'Album',
            number: '01',
            title: 'Song Title',
            id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        }];

        expect(sendFileData.calledWith({
            key: key,
            tracks: expectedTracks
        })).to.be.true;
        expect(filesStore).to.eql({
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx': ['home', 'music', 'Genre', 'Artist', 'Album', '01-Song Title.mp3'].join(path.sep)
        });
    })
});

describe('setupFileWatcher', function() {
    let sendFileData;
    let filesStore;
    let musicDir;
    let updateHash;
    let digestHash;
    let hash;

    const key = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    const mockHostedTracks = {
        'Genre': {
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
        }
    };

    beforeEach(function() {
        sendFileData = sinon.spy();
        filesStore = {};
        musicDir = ['home', 'music'].join(path.sep);
        digestHash = {
            digest: sinon.stub()
        };
        digestHash.digest.onFirstCall().returns('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        digestHash.digest.onSecondCall().returns('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');

        updateHash = {
            update: sinon.stub().returns(digestHash)
        };
        hash = sinon.stub(crypto, 'createHash').returns(updateHash);
    });

    afterEach(function() {
        crypto.createHash.restore();
    });

    it('should return a function', function() {
        const results = setupFileWatcher(sendFileData, filesStore, musicDir, key);

        expect(results).to.be.a('function');
    });

    it('should create watcher that handles created event', function(done) {
        this.timeout(20000);

        const fileWatchHandler = setupFileWatcher(sendFileData, filesStore, musicDir, key);

        const monitor = new EventEmitter();
        const lstatSpy = sinon.stub(fs, 'lstatSync').returns({
            isFile: () => true
        });

        fileWatchHandler(monitor);

        monitor.emit('created', ['home', 'music', 'Genre', 'Artist', 'Album', '01-Song Title.mp3'].join(path.sep));
        monitor.emit('created', ['home', 'music', 'Genre', 'Artist', 'Album', '02-Song Two.mp3'].join(path.sep));

        setTimeout(function() {
            const expectedTracks = [
                {genre: 'Genre', artist: 'Artist', album: 'Album', number: '01', title: 'Song Title', id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'},
                {genre: 'Genre', artist: 'Artist', album: 'Album', number: '02', title: 'Song Two', id: 'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy'}
            ];

            expect(filesStore).to.eql({
                'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx': ['home', 'music', 'Genre', 'Artist', 'Album', '01-Song Title.mp3'].join(path.sep),
                'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy': ['home', 'music', 'Genre', 'Artist', 'Album', '02-Song Two.mp3'].join(path.sep)
            });
            expect(sendFileData.calledWith({
                key: key,
                tracks: expectedTracks
            })).to.be.true;
            done();
        }, 10500);
    });
});
