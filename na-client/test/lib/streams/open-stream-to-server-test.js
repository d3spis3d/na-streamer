import path from 'path';
import {EventEmitter} from 'events';

import {expect} from 'chai';
import sinon from 'sinon';

import openStreamToServer from '../../../js/lib/streams/open-stream-to-server';
import {createStreamToServer} from '../../../js/lib/helper';
import * as files from '../../../js/lib/files';

describe('openStreamToServer', function() {
    it('should create a stream from the client and start file processing', function() {
        const filesStore = {};
        const musicDir = ['home', 'testing', 'music'].join(path.sep);
        const client = {
            createStream: function() { }
        };

        const clientSpy = sinon.stub(client, 'createStream').returns(new EventEmitter());
        const filesSpy = sinon.stub(files, 'setupFilesProcessing');
        const streamToServerSpy = sinon.spy(createStreamToServer);

        console.log('streamTo:', streamToServerSpy.called);

        const results = openStreamToServer(filesStore, musicDir, client);

        expect(clientSpy.called).to.be.true;
        expect(filesSpy.calledWith(filesStore, sinon.match.func, musicDir)).to.be.true;
    });
});
