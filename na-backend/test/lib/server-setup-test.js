import {expect} from 'chai';
import sinon from 'sinon';

import {setupClients, setupStreamers} from '../../js/lib/server-setup';

describe('setupClients', function() {
    it('should return an object', function() {
        const results = setupClients();
        expect(results).to.be.an('object');
    });

    it('should provide an interface to add and get clients', function() {
        const inputClient = {
            ip: '127.0.0.1',
            res: {}
        };

        const clientInterface = setupClients();

        expect(Object.keys(clientInterface.get())).to.eql([]);
        clientInterface.addToChannel(inputClient, 'abcd');
        expect(Object.keys(clientInterface.get())).to.eql(['abcd']);
        expect(clientInterface.get()['abcd']).to.eql([inputClient]);
    });

    it('should provide an interface to write data to all clients', function() {
        const inputClient = {
            ip: '127.0.0.1',
            res: {
                write: sinon.stub()
            }
        };

        const clientInterface = setupClients();
        clientInterface.addToChannel(inputClient, 'abcd');
        clientInterface.writeToAllForChannel({data: 'xyz'}, 'abcd');

        expect(inputClient.res.write.calledWith({data: 'xyz'})).to.equal(true);
    });

    it('should provide an interface to count the connnected clients', function() {
        const inputClient = {
            ip: '127.0.0.1',
            res: {
                write: sinon.stub()
            }
        };

        const clientInterface = setupClients();
        expect(clientInterface.count()).to.eql({});
        clientInterface.addToChannel(inputClient, 'abcd');
        expect(clientInterface.count()).to.eql({abcd: 1});
    });

    it('should provide an interface to remove clients by ip', function() {
        const inputClient = {
            ip: '127.0.0.1',
            res: {}
        };
        const inputClient2 = {
            ip: '0.0.0.0',
            res: {}
        };

        const clientInterface = setupClients();
        expect(clientInterface.count()).to.eql({});
        clientInterface.addToChannel(inputClient, 'abcd');
        clientInterface.addToChannel(inputClient2, 'abcd');
        expect(clientInterface.count()).to.eql({abcd: 2});

        clientInterface.removeByIpFromChannel('127.0.0.1', 'abcd');
        expect(clientInterface.count()).to.eql({abcd: 1});
        expect(clientInterface.get()['abcd']).to.eql([inputClient2]);
    });
});

describe('setupStreamers', function() {
    it('should return an object', function() {
        const results = setupStreamers();
        expect(results).to.be.an('object');
    });

    it('should provide an interface to add to and get streamers', function() {
        const inputStreamer = {};
        const streamerKey = 'abcd';

        const streamersInterface = setupStreamers();
        streamersInterface.add(streamerKey, inputStreamer);
        expect(streamersInterface.get(streamerKey)).to.eql(inputStreamer);
    });
});
