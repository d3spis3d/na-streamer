import {EventEmitter} from 'events';

import {expect} from 'chai';
import sinon from 'sinon';

import setupStreamHandler from '../../js/lib/setup-stream-handler';

describe('setupStreamHandler', function() {
    let writeToAllClients;
    let addToStreamers;
    let updateTrackListing;
    let nextSongInQueue;

    beforeEach(function() {
        writeToAllClients = sinon.spy();
        addToStreamers = sinon.spy();
        updateTrackListing = sinon.spy();
        nextSongInQueue = sinon.spy();
    });

    it('should return a function', function() {
        const results = setupStreamHandler(writeToAllClients, addToStreamers, updateTrackListing, nextSongInQueue);

        expect(results).to.be.a('function');
    });

    it('should return a handler that calls updateTrackListing and addToStreamers on receiving Object', function() {
        const handleStream = setupStreamHandler(writeToAllClients, addToStreamers, updateTrackListing, nextSongInQueue);
        const stream = new EventEmitter();

        const mockData = {
            key: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            tracks: {
                'Artist': {
                    'Album': {
                        '01': {
                            title: 'Song Title',
                            id: 'yyyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
                        }
                    }
                }
            }
        };

        handleStream(stream);
        stream.emit('data', mockData);

        expect(updateTrackListing.calledWith(mockData)).to.be.true;
        expect(addToStreamers.calledWith(mockData.key. stream));
    });

    it('should return a handler that calls writeToAllClients on receiving Buffer', function() {
        const handleStream = setupStreamHandler(writeToAllClients, addToStreamers, updateTrackListing, nextSongInQueue);
        const stream = new EventEmitter();

        const mockData = new Buffer(8);

        handleStream(stream);
        stream.emit('data', mockData);

        expect(writeToAllClients.calledWith(mockData)).to.be.true;
    });

    it('should return a handler that calls nextSongInQueue on receiving String', function() {
        const handleStream = setupStreamHandler(writeToAllClients, addToStreamers, updateTrackListing, nextSongInQueue);
        const stream = new EventEmitter();

        const mockData = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

        handleStream(stream);
        stream.emit('data', mockData);

        expect(nextSongInQueue.called).to.be.true;
    });
});
