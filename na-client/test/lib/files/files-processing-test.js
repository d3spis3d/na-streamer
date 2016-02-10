import fs from 'fs';
import crypto from 'crypto';
import {EventEmitter} from 'events';

import {expect} from 'chai';
import path from 'path';
import sinon from 'sinon';

import {buildFileInfoForBackend} from '../../../js/lib/files/files-parsing';
import {setupFilePathProcessor, setupFileWatcher} from '../../../js/lib/files/files-processing';

describe('setupFilePathProcessor', function() {
    let sendFileData;
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
        const results = setupFilePathProcessor(sendFileData, musicDir, key);

        expect(results).to.be.a('function');
    });

    it('should create processor that does not send data on err', function() {
        const processFiles = setupFilePathProcessor(sendFileData, musicDir, key);

        processFiles('Error', []);

        expect(sendFileData.called).to.be.false;
    });

    it('should create processor that processes files and sends data', function() {
        const processFiles = setupFilePathProcessor(sendFileData, musicDir, key);
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

        expect(sendFileData.calledWith({
            key: key,
            tracks: {
                genres: [{name: 'Genre'}],
                artists: [{name: 'Artist', genre: 'Genre'}],
                albums: [{title: 'Album', artist: 'Artist'}],
                songs: [{
                    title: 'Song Title',
                    id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                    number: '01',
                    album: 'Album'
                }]
            }
        })).to.be.true;
    });
});

describe('setupFileWatcher', function() {
    let sendFileData;
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
        const results = setupFileWatcher(sendFileData, musicDir, key);

        expect(results).to.be.a('function');
    });

    it('should create watcher that handles created event', function(done) {
        this.timeout(20000);

        const fileWatchHandler = setupFileWatcher(sendFileData, musicDir, key);

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

            expect(sendFileData.calledWith({
                key: key,
                tracks: {
                    genres: [{name: 'Genre'}],
                    artists: [{name: 'Artist', genre: 'Genre'}],
                    albums: [{title: 'Album', artist: 'Artist'}],
                    songs: [
                        {
                            title: 'Song Title',
                            id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                            number: '01',
                            album: 'Album'
                        },
                        {
                            title: 'Song Two',
                            id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                            number: '02',
                            album: 'Album'
                        }
                    ]
                }
            })).to.be.true;
            done();
        }, 10500);
    });
});
