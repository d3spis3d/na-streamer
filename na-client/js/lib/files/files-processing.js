import fs from 'fs';

import Rx from 'rx';

import extractTrack, {buildFileInfoForBackend} from './files-parsing';

const CLIENT_KEYFILE = '.clientkey';

export function setupFilePathProcessor(sendFileData, processTracks, musicDir, key) {
    return function(err, files) {
        if (err) {
            console.log(err);
            return;
        }

        if (files) {
            const tracks = files.filter(file => file.indexOf(CLIENT_KEYFILE) === -1)
                                .map(extractTrack(musicDir));
            const hostedTracks = processTracks(tracks, buildFileInfoForBackend, {});
            sendFileData({
                key: key,
                tracks: hostedTracks
            });
        }
    };
}

export function setupFileWatcher(sendFileData, processTracks, musicDir, key) {
    return function(monitor) {
        Rx.Observable.fromEvent(monitor, 'created')
            .filter((file) => {
                return fs.lstatSync(file).isFile();
            })
            .bufferWithTime(10000)
            .map((files) => {
                const tracks = files.map(extractTrack(musicDir));
                return processTracks(tracks, buildFileInfoForBackend, {});;
            })
            .subscribe((tracks) => {
                if (Object.keys(tracks).length > 0) {
                    sendFileData({
                        key: key,
                        tracks: tracks
                    });
                }
            });

        monitor.on('removed', (file) => {
            console.log('removing file:', file);
        });
    };
}
