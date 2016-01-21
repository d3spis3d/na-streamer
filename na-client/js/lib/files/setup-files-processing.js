import dir from 'node-dir';
import watch from 'watch';

import {reduceAndMemoize} from '../helper';
import {setupFilePathProcessor, setupFileWatcher} from './files-processing';

export default function(filesStore, sendFileData, musicDir, key) {
    const processTracks = reduceAndMemoize(filesStore, 'id', 'file');

    dir.files(musicDir, setupFilePathProcessor(sendFileData, processTracks, musicDir, key));
    watch.createMonitor(musicDir, setupFileWatcher(sendFileData, processTracks, musicDir, key));
}
