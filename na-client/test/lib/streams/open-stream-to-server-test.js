import path from 'path';
import {EventEmitter} from 'events';

import {expect} from 'chai';
import sinon from 'sinon';

import openStreamToServer from '../../../js/lib/streams/open-stream-to-server';
import * as helpers from '../../../js/lib/helper';
import * as setupFilesProcessing from '../../../js/lib/files/setup-files-processing';

describe('openStreamToServer', function() {
    it('should create a stream from the client and start file processing', function() {
        const filesStore = {};
        const musicDir = ['home', 'testing', 'music'].join(path.sep);
        const client = {
            createStream: function() { }
        };

        const mockStream = new EventEmitter();
        const clientSpy = sinon.stub(client, 'createStream').returns(mockStream);
        const filesSpy = sinon.stub(setupFilesProcessing, 'default');
        const mockWriteStream = sinon.spy();
        const writeSpy = sinon.stub(helpers, 'createWriteStream').returns(mockWriteStream);
        const key = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

        const results = openStreamToServer(filesStore, musicDir, client, key);

        expect(writeSpy.calledWith(mockStream)).to.be.true;
        expect(clientSpy.called).to.be.true;
        expect(filesSpy.calledWith(filesStore, mockWriteStream, musicDir, key)).to.be.true;
    });
});
