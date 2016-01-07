import {getSongByUUID} from '../../js/routes/song';
import {expect} from 'chai';
import sinon from 'sinon';

describe('Song route', function() {
    describe('getSongByUUID', function() {
        it('should have correct url', function() {
            const expectedUrl = '/song/:uuid';

            expect(getSongByUUID.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function() {
            const filesByStreamer = {};
            const streamers = {};

            const results = getSongByUUID.generateHandler(filesByStreamer, streamers);
            expect(results).to.be.a('function');
        });

        it('should generate a handler than requests a streamer for song by uuid', function() {
            const filesByStreamer = {
                'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx': 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
            };
            const streamers = {
                'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy': {
                    write: function() { }
                }
            };
            const streamSpy = sinon.spy(streamers['yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'], 'write');

            const inputRequest = {
                params: {
                    uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
                }
            };
            const inputResponse = {
                sendStatus: function() { }
            };
            const respSpy = sinon.spy(inputResponse, 'sendStatus');

            const handler = getSongByUUID.generateHandler(filesByStreamer, streamers);
            handler(inputRequest, inputResponse);

            expect(streamSpy.calledWith(inputRequest.params.uuid));
            expect(respSpy.calledWith(200));
        });
    });
});
