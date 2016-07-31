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

        expect(clientInterface.get().length).to.equal(0);
        clientInterface.add(inputClient);
        expect(clientInterface.get().length).to.equal(1);
        expect(clientInterface.get()[0]).to.eql(inputClient);
    });

    it('should provide an interface to write data to all clients', function() {
        const inputClient = {
            ip: '127.0.0.1',
            res: {
                write: sinon.stub()
            }
        };

        const clientInterface = setupClients();
        clientInterface.add(inputClient);
        clientInterface.writeToAll({data: 'xyz'});

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
        expect(clientInterface.count()).to.equal(0);
        clientInterface.add(inputClient);
        expect(clientInterface.count()).to.equal(1);
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
        expect(clientInterface.count()).to.equal(0);
        clientInterface.add(inputClient);
        clientInterface.add(inputClient2);
        expect(clientInterface.count()).to.equal(2);

        clientInterface.removeByIp('127.0.0.1');
        expect(clientInterface.count()).to.equal(1);
        expect(clientInterface.get()[0]).to.equal(inputClient2);
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
