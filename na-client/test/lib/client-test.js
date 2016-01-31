import {EventEmitter} from 'events';
import path from 'path';
import binaryjs from 'binaryjs';

import {expect} from 'chai';
import sinon from 'sinon';

import * as openStreamToServer from '../../js/lib/streams/open-stream-to-server';
import {startClient} from '../../js/lib/client';

describe('startClient', function() {
    it('should call openStreamToServer on open event', function() {
        const filesStore = {};
        const options = {
            dir: ['home', 'test', 'music'].join(path.sep),
            host: 'localhost',
            port: 9000
        };
        const clientSpy = sinon.stub(binaryjs, 'BinaryClient').returns(new EventEmitter());
        const openStreamSpy = sinon.stub(openStreamToServer, 'default');
        const key = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

        const client = startClient(filesStore, options, key);

        client.emit('open');

        expect(clientSpy.calledWith('ws://localhost:9000'));
        expect(openStreamSpy.calledWith(filesStore, options.dir, client, key)).to.be.true;
        openStreamToServer.default.restore();
    });
});
