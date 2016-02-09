import dir from 'node-dir';
import watch from 'watch';

import {setupFilePathProcessor, setupFileWatcher} from './files-processing';

export default function(filesStore, sendFileData, musicDir, key) {
    dir.files(musicDir, setupFilePathProcessor(sendFileData, filesStore, musicDir, key));
    watch.createMonitor(musicDir, setupFileWatcher(sendFileData, filesStore, musicDir, key));
}
