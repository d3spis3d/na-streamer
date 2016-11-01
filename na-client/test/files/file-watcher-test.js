import fs from 'fs';
import crypto from 'crypto';
import {EventEmitter} from 'events';

import {expect} from 'chai';
import path from 'path';
import sinon from 'sinon';

import fileWatcher from '../../js/files/file-watcher';

describe('fileWatcher', function() {
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
