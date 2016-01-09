import {getLibrary} from '../../js/routes/library';
import {expect} from 'chai';
import sinon from 'sinon';

describe('Library route', function() {
    describe('getLibrary', function() {
        it('should have correct url', function() {
            const expectedUrl = '/library';

            expect(getLibrary.url).to.equal(expectedUrl);
        });

        it('should return a function from generateHandler', function() {
            const tracks = {};

            const results = getLibrary.generateHandler(tracks);
            expect(results).to.be.a('function');
        });

        it('should generate a handler than returns track listing', function() {
            const tracks = {
                'Artist': {
                    'Album': {
                        '01': {
                            title: 'Song Title',
                            id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
                        }
                    }
                }
            };

            const req = {};
            const res = {
                send: function() { }
            };

            const resSpy = sinon.spy(res, 'send');

            const handler = getLibrary.generateHandler(tracks);
            handler(req, res);

            expect(resSpy.calledWith(JSON.stringify(tracks)));
        });
    });
});
