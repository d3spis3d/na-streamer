import {expect} from 'chai';
import sinon from 'sinon';

import {setClientList, setTrackListingMap, createStreamersUpdate,
        setupInitQueue, setupNextSong} from '../../js/lib/server-helper';

describe('setClientList', function() {
    it('should return a function', function() {
        const input = [];

        const results = setClientList(input);

        expect(results).to.be.a('function');
    });

    it('should generate a function to write data to all clients', function() {
        const client1 = {
            res: {
                write: function() { }
            }
        };
        const client2 = {
            res: {
                write: function() { }
            }
        };

        const spy1 = sinon.spy(client1.res, 'write');
        const spy2 = sinon.spy(client2.res, 'write');

        const clients = [client1, client2];
        const inputData = 'test data';

        const writeToAllClients = setClientList(clients);
        writeToAllClients(inputData);

        expect(spy1.calledWith(inputData));
        expect(spy2.calledWith(inputData));
    });
});

describe('setTrackListingMap', function() {
    it('should return a function', function() {
        const tracks = {};
        const filesByStreamer = {};
        const streamerId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

        const results = setTrackListingMap(tracks, filesByStreamer, streamerId);

        expect(results).to.be.a('function');
    });

    it('should generate a function to update tracks and files by streamer id', function() {
        const tracks = {};
        const filesByStreamer = {};
        const streamerId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

        const inputData = {
            'Artist': {
                'Album1': {
                    '01': {
                        title: 'Track One',
                        id: 'yyyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
                    }
                },
                'Album2': {
                    '01': {
                        title: 'First Song',
                        id: 'zzzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz'
                    }
                }
            }
        };

        const expectedTracks = {
            'Artist': {
                'Album1': {
                    '01': {
                        title: 'Track One',
                        id: 'yyyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
                    }
                },
                'Album2': {
                    '01': {
                        title: 'First Song',
                        id: 'zzzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz'
                    }
                }
            }
        };
        const expectedFilesByStreamer = {
            'yyyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            'zzzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
        };

        const updateTrackListing = setTrackListingMap(tracks, filesByStreamer, streamerId);

        updateTrackListing(inputData);
        expect(tracks).to.eql(expectedTracks);
        expect(filesByStreamer).to.eql(expectedFilesByStreamer);
    });

    it('should generate a function to update tracks and files by streamer id when tracks already exist', function() {
        const tracks = {
            'Artist': {
                'Album Zero': {
                    '01': {
                        title: 'Numero Uno',
                        id: 'wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww'
                    }
                }
            }
        };
        const filesByStreamer = {
            'wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww': 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
        };
        const streamerId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

        const inputData = {
            'Artist': {
                'Album1': {
                    '01': {
                        title: 'Track One',
                        id: 'yyyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
                    }
                },
                'Album2': {
                    '01': {
                        title: 'First Song',
                        id: 'zzzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz'
                    }
                }
            }
        };

        const expectedTracks = {
            'Artist': {
                'Album Zero': {
                    '01': {
                        title: 'Numero Uno',
                        id: 'wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww'
                    }
                },
                'Album1': {
                    '01': {
                        title: 'Track One',
                        id: 'yyyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
                    }
                },
                'Album2': {
                    '01': {
                        title: 'First Song',
                        id: 'zzzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz'
                    }
                }
            }
        };
        const expectedFilesByStreamer = {
            'wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww': 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            'yyyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            'zzzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
        };

        const updateTrackListing = setTrackListingMap(tracks, filesByStreamer, streamerId);

        updateTrackListing(inputData);
        expect(tracks).to.eql(expectedTracks);
        expect(filesByStreamer).to.eql(expectedFilesByStreamer);
    });
});

describe('createStreamersUpdate', function() {
    it('should return a function', function() {
        const streamers = {};

        const results = createStreamersUpdate(streamers);

        expect(results).to.be.a('function');
    });

    it('should return a function to set stream by stream id', function() {
        const streamers = {};

        const updateStreamers = createStreamersUpdate(streamers);

        const expectedResults = {
            'wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww': 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
        };

        updateStreamers('wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
        expect(streamers).to.eql(expectedResults);
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

    it('should return a function that sets up a queue of five songs and plays the first', function() {
        const songQueue = {
            push: () => { },
            shift: () => { }
        };
        const pushSpy = sinon.spy(songQueue, 'push');
        const shiftSpy = sinon.stub(songQueue, 'shift').returns('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

        const filesByStreamer = {
            'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx': 'yyyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
        };

        const writeSpy = sinon.spy();
        const streamers = {
            'yyyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy': {
                write: writeSpy
            }
        };

        const initQueue = setupInitQueue(songQueue, filesByStreamer, streamers);

        initQueue();
        expect(pushSpy.callCount).to.equal(5);
        expect(shiftSpy.callCount).to.equal(1);
        expect(writeSpy.calledWith('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')).to.be.true;
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

    it('should return a function that starts the streaming of the next song in the queue', function () {
        const songQueue = {
            shift: () => { }
        };
        const shiftSpy = sinon.stub(songQueue, 'shift').returns('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

        const filesByStreamer = {
            'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx': 'yyyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
        };

        const writeSpy = sinon.spy();
        const streamers = {
            'yyyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy': {
                write: writeSpy
            }
        };

        const nextSong = setupNextSong(songQueue, filesByStreamer, streamers);

        nextSong();
        expect(shiftSpy.callCount).to.equal(1);
        expect(writeSpy.calledWith('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')).to.be.true;
    });
});
