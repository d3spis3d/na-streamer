import fs from 'fs';
import crypto from 'crypto';
import {EventEmitter} from 'events';

import {expect} from 'chai';
import path from 'path';
import sinon from 'sinon';

import fileProcessor from '../../js/files/file-processor';

describe('fileProcessor', function() {
    let sendFileData;
    let processTracks;
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
                        id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                    }
                }
            }
        }
    };


    beforeEach(function() {
        sendFileData = sinon.spy();
        processTracks = sinon.stub().returns(mockHostedTracks);
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
        processTracks = null;
        crypto.createHash.restore();
    });

    it('should return a function', function() {
        const results = setupFilePathProcessor(sendFileData, processTracks, musicDir, key);

        expect(results).to.be.a('function');
    });

    it('should create processor that does not send data on err', function() {
        const processFiles = setupFilePathProcessor(sendFileData, processTracks, musicDir, key);

        processFiles('Error', []);

        expect(sendFileData.called).to.be.false;
        expect(processTracks.called).to.be.false;
    });

    it('should create processor that processes files and sends data', function() {
        const processFiles = setupFilePathProcessor(sendFileData, processTracks, musicDir, key);
        const files = [['home', 'music', 'Genre', 'Artist', 'Album', '01-Song Title.mp3'].join(path.sep)];

        processFiles(null, files);

        const expectedTracks = [{
            genre: 'Genre',
            artist: 'Artist',
            album: 'Album',
            file: ['home', 'music', 'Genre', 'Artist', 'Album', '01-Song Title.mp3'].join(path.sep),
            number: '01',
            title: 'Song Title',
            id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        }];

        expect(processTracks.calledWith(expectedTracks, sinon.match.func, {})).to.be.true;
        expect(sendFileData.calledWith({
            key: key,
            tracks: {
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
            }
        })).to.be.true;
        console.log(sendFileData.firstCall.args);
    })
});describe('setupFileWatcher', function() {
    let sendFileData;
    let processTracks;
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
        processTracks = sinon.stub().returns(mockHostedTracks);
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
        crypto.createHash.restore();
    });

    it('should return a function', function() {
        const results = setupFileWatcher(sendFileData, processTracks, musicDir, key);

        expect(results).to.be.a('function');
    });

    it('should create watcher that handles created event', function(done) {
        this.timeout(20000);

        const fileWatchHandler = setupFileWatcher(sendFileData, processTracks, musicDir, key);

        const monitor = new EventEmitter();
        const lstatSpy = sinon.stub(fs, 'lstatSync').returns({
            isFile: () => true
        });

        fileWatchHandler(monitor);

        monitor.emit('created', ['home', 'music', 'Genre', 'Artist', 'Album', '01-Song Title.mp3'].join(path.sep));
        monitor.emit('created', ['home', 'music', 'Genre', 'Artist', 'Album', '02-Song Two.mp3'].join(path.sep));

        setTimeout(function() {
            const expectedTracks = [
                {genre: 'Genre', artist: 'Artist', album: 'Album', number: '01', title: 'Song Title', id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', file: ['home', 'music', 'Genre', 'Artist', 'Album', '01-Song Title.mp3'].join(path.sep)},
                {genre: 'Genre', artist: 'Artist', album: 'Album', number: '02', title: 'Song Two', id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', file: ['home', 'music', 'Genre', 'Artist', 'Album', '02-Song Two.mp3'].join(path.sep)}
            ];

            expect(processTracks.args[0][0]).to.eql(expectedTracks);
            expect(processTracks.calledWith(expectedTracks, buildFileInfoForBackend, {})).to.be.true;
            expect(sendFileData.calledWith({
                key: key,
                tracks: {
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
                }
            })).to.be.true;
            done();
        }, 10500);
    });
});
