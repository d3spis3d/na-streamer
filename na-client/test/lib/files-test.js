import {createTrackData, extractTrack, buildFileInfoForBackend,
        setupFilePathProcessor, setupFileWatcher} from '../../js/lib/files';
import {expect} from 'chai';
import path from 'path';
import sinon from 'sinon';
import uuid from 'node-uuid';
import fs from 'fs';
import {EventEmitter} from 'events';

describe('Files function', function() {
    describe('createTrackData', function() {
        it('should correctly split song string', function() {
            const input = '01-Song Title.mp3';

            const expectedNumber = '01';
            const expectedTitle = 'Song Title';
            const expectedId = /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/;

            const result = createTrackData(input);
            expect(result.number).to.equal(expectedNumber);
            expect(result.title).to.equal(expectedTitle);
            expect(result.id).to.be.match(expectedId);
        });
    });

    describe('extractTrack', function() {
        it('should return a function', function() {
            const input = '/home/test/music';

            const result = extractTrack(input);
            expect(result).to.be.a('function');
        });

        it('should correctly extract track data from file path', function() {
            const musicDir = ['home', 'test', 'music'].join(path.sep);
            const input = ['home', 'test', 'music', 'Artist', 'Album', '01-Song Title.mp3'].join(path.sep);

            const expectedResult = {
                artist: 'Artist',
                album: 'Album',
                file: input,
                number: '01',
                title: 'Song Title',
                id: /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/
            };

            const func = extractTrack(musicDir);
            const result = func(input);

            expect(result.artist).to.equal(expectedResult.artist);
            expect(result.album).to.equal(expectedResult.album);
            expect(result.file).to.equal(expectedResult.file);
            expect(result.number).to.equal(expectedResult.number);
            expect(result.title).to.equal(expectedResult.title);
            expect(result.id).to.match(expectedResult.id);
        });
    });

    describe('buildFileInfoForBackend', function() {
        it('should build file map from empty object', function() {
            const input = {
                artist: 'Artist',
                album: 'Album',
                number: '01',
                title: 'Song Title',
                id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx'
            };

            const expectedResults = {
                Artist: {
                    Album: {
                        '01': {
                            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx',
                            title: 'Song Title'
                        }
                    }
                }
            };

            const results = buildFileInfoForBackend({}, input);
            expect(results).to.eql(expectedResults);
        });

        it('should build file map with object containing artist tracks', function() {
            const input = {
                artist: 'Artist',
                album: 'Album',
                number: '02',
                title: 'Another Song',
                id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx'
            };
            const mapInput = {
                Artist: {
                    Album: {
                        '01': {
                            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx',
                            title: 'Song Title'
                        }
                    }
                }
            };

            const expectedResults = {
                Artist: {
                    Album: {
                        '01': {
                            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx',
                            title: 'Song Title'
                        },
                        '02': {
                            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx',
                            title: 'Another Song'
                        }
                    }
                }
            };

            const results = buildFileInfoForBackend(mapInput, input);
            expect(results).to.eql(expectedResults);
        });

        it('should build file map with object containing other artists', function() {
            const input = {
                artist: 'Artist2',
                album: 'AlbumZ',
                number: '01',
                title: 'Test Song',
                id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx'
            };
            const mapInput = {
                Artist: {
                    Album: {
                        '01': {
                            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx',
                            title: 'Song Title'
                        }
                    }
                }
            };

            const expectedResults = {
                Artist: {
                    Album: {
                        '01': {
                            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx',
                            title: 'Song Title'
                        }
                    }
                },
                Artist2: {
                    AlbumZ: {
                        '01': {
                            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx',
                            title: 'Test Song'
                        }
                    }
                }
            };

            const results = buildFileInfoForBackend(mapInput, input);
            expect(results).to.eql(expectedResults);
        });
    });

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
            uuidSpy = sinon.spy(uuid, 'v4');
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
                id: uuidSpy.returnValues[0]
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
});
