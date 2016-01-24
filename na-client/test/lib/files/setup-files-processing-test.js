import path from 'path';
import dir from 'node-dir';
import watch from 'watch';

import {expect} from 'chai';
import sinon from 'sinon';

import setupFilesProcessing from '../../../js/lib/files/setup-files-processing';
import * as filesProcessing from '../../../js/lib/files/files-processing';

describe('setupFilesProcessing', function() {
    let dirSpy;
    let watchSpy;
    let filePathProcessor;
    let filePathSpy;
    let fileWatcher;
    let fileWatcherSpy;
    const key = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

    beforeEach(function() {
        dirSpy = sinon.stub(dir, 'files');
        watchSpy = sinon.stub(watch, 'createMonitor');
        filePathProcessor = sinon.spy();
        filePathSpy = sinon.stub(filesProcessing, 'setupFilePathProcessor').returns(filePathProcessor);
        fileWatcher = sinon.spy();
        fileWatcherSpy = sinon.stub(filesProcessing, 'setupFileWatcher').returns(fileWatcher);
    });

    afterEach(function() {
        dir.files.restore();
        watch.createMonitor.restore();
        filesProcessing.setupFilePathProcessor.restore();
        filesProcessing.setupFileWatcher.restore();
    });

    it('should call dir.files and watch.createMonitor', function() {
        const filesStore = {};
        const sendFileData = sinon.spy();
        const musicDir = ['home', 'music'].join(path.sep);

        setupFilesProcessing(filesStore, sendFileData, musicDir, key);

        expect(dirSpy.calledWith(musicDir, filePathProcessor)).to.be.true;
        expect(watchSpy.calledWith(musicDir, fileWatcher)).to.be.true;

        expect(filePathSpy.calledWith(sendFileData, sinon.match.func, musicDir, key)).to.be.true;
        expect(fileWatcherSpy.calledWith(sendFileData, sinon.match.func, musicDir, key)).to.be.true;
    });
});
