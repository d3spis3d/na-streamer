import fs from 'fs';
import Rx from 'rx';

import extractTrack from './extract-track';
import buildFileInfoForBackend from './build-file-info';
import reduceAndMemoize from '../lib/reduce-and-memoize';

export default function fileWatcher(monitor, filesById, sendFileData, musicDir) {
        Rx.Observable.fromEvent(monitor, 'created')
            .filter((file) => {
                return fs.lstatSync(file).isFile();
            })
            .bufferWithTime(10000)
            .map((files) => {
                const tracks = files.map(extractTrack(musicDir));
                const processTracks = reduceAndMemoize(filesById, 'id', 'file');
                return processTracks(tracks, buildFileInfoForBackend, {});
            })
            .subscribe((tracks) => {
                if (Object.keys(tracks).length > 0) {
                    sendFileData(tracks);
                }
            });

        monitor.on('removed', (file) => {
            console.log('removing file:', file);
        });
    };
}
