import fs from 'fs';

import Rx from 'rx';

import extractTrack from './files-parsing';

const CLIENT_KEYFILE = '.clientkey';

export function setupFilePathProcessor(sendFileData, filesStore, musicDir, key) {
    return function(err, files) {
        if (err) {
            console.log(err);
            return;
        }

        if (files) {
            const tracks = files
                .filter(file => file.indexOf(CLIENT_KEYFILE) === -1)
                .map(extractTrack(musicDir, filesStore));
            sendFileData({
                key,
                tracks
            });
        }
    };
}

export function setupFileWatcher(sendFileData, filesStore, musicDir, key) {
    return function(monitor) {
        Rx.Observable.fromEvent(monitor, 'created')
            .filter((file) => {
                return fs.lstatSync(file).isFile();
            })
            .bufferWithTime(10000)
            .map((files) => {
                return files.map(extractTrack(musicDir, filesStore));
            })
            .subscribe((tracks) => {
                if (tracks.length > 0) {
                    sendFileData({
                        key,
                        tracks
                    });
                }
            });

        monitor.on('removed', (file) => {
            console.log('removing file:', file);
        });
    };
}
