import * as openStreamToServer from '../../js/lib/streams/open-stream-to-server';
import {startClient} from '../../js/lib/client';

import {EventEmitter} from 'events';
import path from 'path';

import {expect} from 'chai';
import sinon from 'sinon';
import binaryjs from 'binaryjs';


describe('Client functions', function() {
    describe('startClient', function() {
        it('should call openStreamToServer on open event', function() {
            const filesStore = {};
            const musicDir = ['home', 'test', 'music'].join(path.sep);
            const clientSpy = sinon.stub(binaryjs, 'BinaryClient').returns(new EventEmitter());
            const openStreamSpy = sinon.stub(openStreamToServer, 'default');

            const client = startClient(filesStore, musicDir);

            client.emit('open');

            expect(openStreamSpy.calledWith(filesStore, musicDir, client)).to.be.true;
            openStreamToServer.default.restore();
        });
    });
});
