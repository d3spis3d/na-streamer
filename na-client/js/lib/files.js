import path from 'path';
import fs from 'fs';

import dir from 'node-dir';
import watch from 'watch';
import uuid from 'node-uuid';
import Rx from 'rx';

import {reduceAndMemoize} from './helper';

export function setupFilesProcessing(filesStore, sendFileData, musicDir) {
    const processTracks = reduceAndMemoize(filesStore, 'id', 'file');

    dir.files(musicDir, setupFilePathProcessor(sendFileData, processTracks, musicDir));

    watch.createMonitor(musicDir, (monitor) => {
        Rx.Observable.fromEvent(monitor, 'created')
            .filter((file) => {
                return fs.lstatSync(file).isFile();
            })
            .bufferWithTime(30000)
            .map((files) => {
                const tracks = files.map(extractTrack(musicDir));
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
    });
}

export function setupFilePathProcessor(sendFileData, processTracks, musicDir) {
    return function(err, files) {
        if (err) {
            console.log(err);
            return;
        }

        if (files) {
            const tracks = files.map(extractTrack(musicDir));
            const hostedTracks = processTracks(tracks, buildFileInfoForBackend, {});
            sendFileData(hostedTracks);
        }
    };
}

export function extractTrack(musicDir) {
    return function(file) {
        const [artist, album, songFile] = path.relative(musicDir, file).split(path.sep);
        const {number, title, id} = createTrackData(songFile);
        return {
            artist,
            album,
            file,
            number,
            title,
            id
        };
    }
}

export function createTrackData(songFile) {
    const [number, song] = songFile.split('-');
    const [title, ] = song.split('.');
    const id = uuid.v4();
    return {
        number, title, id
    };
}

export function buildFileInfoForBackend(map, track) {
    map[track.artist] = map[track.artist] || {};
    map[track.artist][track.album] = map[track.artist][track.album] || {};
    map[track.artist][track.album][track.number] = {id: track.id, title: track.title};
    return map;
}
