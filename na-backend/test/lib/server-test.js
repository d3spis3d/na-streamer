import {setClientList, setTrackListingMap} from '../../js/lib/server';
import {expect} from 'chai';
import sinon from 'sinon';

describe('Server function', function() {
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
    });
});
