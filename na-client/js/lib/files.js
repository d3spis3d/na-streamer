import path from 'path';
import fs from 'fs';

import dir from 'node-dir';
import watch from 'watch';
import uuid from 'node-uuid';

import {reduceAndMemoize} from './helper';

export function setupFilesProcessing(filesStore, sendFileData, musicDir) {
    const processTracks = reduceAndMemoize(filesStore, 'id', 'file');

    dir.files(musicDir, (err, files) => {
        if (err) {
            console.log(err);
            return;
        }

        if (files) {
            const tracks = files.map(extractTrack(musicDir));
            const hostedTracks = processTracks(tracks, buildFileInfoForBackend, {});
            sendFileData(hostedTracks);
        }
    });

    watch.createMonitor(musicDir, (monitor) => {
        monitor.on('created', (file) => {
            fs.lstat(file, (err, stat) => {
                if (stat.isFile()) {
                    const tracks = [file].map(extractTrack(musicDir));
                    const hostedTracks = processTracks(tracks, buildFileInfoForBackend, {});
                    sendFileData(hostedTracks);
                }
            });
        });

        monitor.on('removed', (file) => {
            console.log('removing file:', file);
        });
    });
}

function extractTrack(musicDir) {
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

function createTrackData(songFile) {
    const [number, song] = songFile.split('-');
    const [title, ] = song.split('.');
    const id = uuid.v1();
    return {
        number, title, id
    };
}

function buildFileInfoForBackend(map, track) {
    map[track.artist] = map[track.artist] || {};
    map[track.artist][track.album] = map[track.artist][track.album] || {};
    map[track.artist][track.album][track.number] = {id: track.id, title: track.title};
    return map;
}
