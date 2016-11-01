import fs from 'fs';
import Rx from 'rx';

import extractTrack, { buildFileInfoForBackend } from './files-parsing';
import { reduceAndMemoize } from '../lib/helper';

const CLIENT_KEYFILE = '.clientkey';
const DS_STORE = '.DS_Store';

export function fileProcessor(filesById, musicDir, files) {
    const tracks = files.filter(file => {
        if (file.indexOf(CLIENT_KEYFILE) !== -1) {
            return false;
        }
        if (file.indexOf(DS_STORE) !== -1) {
            return false;
        }
        return true;
    })
    .map(extractTrack(musicDir));

    const processTracks = reduceAndMemoize(filesById, 'id', 'file');
    return processTracks(tracks, buildFileInfoForBackend, {});
}

export function fileWatcher(monitor, sendFileData, musicDir) {
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
