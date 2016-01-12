import {EventEmitter} from 'events';

import {expect} from 'chai';
import sinon from 'sinon';

import setupStreamHandler from '../../js/lib/setup-stream-handler';

describe('setupStreamHandler', function() {
    let writeToAllClients;
    let addToStreamers;
    let updateTrackListing;
    let streamerId;

    beforeEach(function() {
        writeToAllClients = sinon.spy();
        addToStreamers = sinon.spy();
        updateTrackListing = sinon.spy();
        streamerId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    });

    it('should return a function', function() {
        const results = setupStreamHandler(writeToAllClients, addToStreamers, updateTrackListing, streamerId);

        expect(results).to.be.a('function');
    });

    it('should return a handler that adds stream to streamers', function() {
        const handleStream = setupStreamHandler(writeToAllClients, addToStreamers, updateTrackListing, streamerId);
        const stream = new EventEmitter();

        handleStream(stream);
        expect(addToStreamers.calledWith(streamerId, stream)).to.be.true;
    });

    it('should return a handler that calls updateTrackListing on receiving Object', function() {
        const handleStream = setupStreamHandler(writeToAllClients, addToStreamers, updateTrackListing, streamerId);
        const stream = new EventEmitter();

        const mockData = {
            'Artist': {
                'Album': {
                    '01': {
                        title: 'Song Title',
                        id: 'yyyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
                    }
                }
            }
        };

        handleStream(stream);
        stream.emit('data', mockData);

        expect(updateTrackListing.calledWith(mockData)).to.be.true;
    });

    it('should return a handler that calls writeToAllClients on receiving Buffer', function() {
        const handleStream = setupStreamHandler(writeToAllClients, addToStreamers, updateTrackListing, streamerId);
        const stream = new EventEmitter();

        const mockData = new Buffer(8);

        handleStream(stream);
        stream.emit('data', mockData);

        expect(writeToAllClients.calledWith(mockData)).to.be.true;
    });
});
