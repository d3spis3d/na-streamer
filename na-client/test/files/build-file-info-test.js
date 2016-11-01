import buildFileInfoForBackend from '../../js/files/build-file-info';

import { expect } from 'chai';

describe('buildFileInfoForBackend', function() {
    it('should build file map from empty object', function() {
        const input = {
            genre: 'Genre',
            artist: 'Artist',
            album: 'Album',
            number: '01',
            title: 'Song Title',
            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx'
        };

        const expectedResults = {
            Genre: {
                Artist: {
                    Album: {
                        '01': {
                            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx',
                            title: 'Song Title'
                        }
                    }
                }
            }
        };

        const results = buildFileInfoForBackend({}, input);
        expect(results).to.eql(expectedResults);
    });

    it('should build file map with object containing artist tracks', function() {
        const input = {
            genre: 'Genre',
            artist: 'Artist',
            album: 'Album',
            number: '02',
            title: 'Another Song',
            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx'
        };
        const mapInput = {
            Genre: {
                Artist: {
                    Album: {
                        '01': {
                            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx',
                            title: 'Song Title'
                        }
                    }
                }
            }
        };

        const expectedResults = {
            Genre: {
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
            }
        };

        const results = buildFileInfoForBackend(mapInput, input);
        expect(results).to.eql(expectedResults);
    });

    it('should build file map with object containing other artists', function() {
        const input = {
            genre: 'Genre',
            artist: 'Artist2',
            album: 'AlbumZ',
            number: '01',
            title: 'Test Song',
            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx'
        };
        const mapInput = {
            Genre: {
                Artist: {
                    Album: {
                        '01': {
                            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx',
                            title: 'Song Title'
                        }
                    }
                }
            }
        };

        const expectedResults = {
            Genre: {
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
            }
        };

        const results = buildFileInfoForBackend(mapInput, input);
        expect(results).to.eql(expectedResults);
    });
});
