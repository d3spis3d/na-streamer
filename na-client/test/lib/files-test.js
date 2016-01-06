import {createTrackData, extractTrack, buildFileInfoForBackend} from '../../js/lib/files';
import {expect} from 'chai';
import path from 'path';

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
});
