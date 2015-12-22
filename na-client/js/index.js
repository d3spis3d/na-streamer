import path from 'path';
import fs from 'fs';

import dir from 'node-dir';
import watch from 'watch';
import commandLineArgs from 'command-line-args';
import uuid from 'node-uuid';
import {BinaryClient} from 'binaryjs';

const cli = commandLineArgs([
    {
        name: 'dir',
        alias: 'd',
        type: String
    }
]);
const options = cli.parse();

const filesById = {};

function createStreamToServer(stream) {
    return function(hostedFileData) {
        stream.write(hostedFileData);
    };
}

const client = BinaryClient('ws://localhost:9000');
let sendFileData;

client.on('open', function() {
    console.log('opened connection');
    const stream = client.createStream();
    sendFileData = createStreamToServer(stream);
});
client.on('close', function() {
    console.log('connection closed');
});
client.on('error', function(err) {
    console.log('error: ', err);
});

function createTrackData(songFile) {
    const [number, song] = songFile.split('-');
    const [title, ] = song.split('.');
    const id = uuid.v1();
    return {
        number, title, id
    };
}

function extractTrack(file) {
    const [artist, album, songFile] = path.relative(options.dir, file).split(path.sep);
    const track = createTrackData(songFile);
    return {
        artist,
        album,
        file,
        ...track
    };
}

function updateTrackMap(map, track) {
    map[track.id] = track.file;
    return map;
}

function buildFileInfoForBackend(map, track) {
    map[track.artist] = map[track.artist] || {};
    map[track.artist][track.album] = map[track.artist][track.album] || {};
    map[track.artist][track.album][track.number] = {id: track.id, title: track.title};
    return map;
}

function processFiles(files) {
    const hostedFiles = {};
    const tracks = files.map(extractTrack);

    tracks.reduce(updateTrackMap, filesById);
    tracks.reduce(buildFileInfoForBackend, hostedFiles);
    sendFileData(hostedFiles);
}

dir.files(options.dir, (err, files) => {
    if (err) {
        console.log(err);
        return;
    }

    if (files) {
        processFiles(files);
    }
});

watch.createMonitor(options.dir, (monitor) => {
    monitor.on('created', (file) => {
        fs.lstat(file, (err, stat) => {
            if (stat.isFile()) {
                processFiles([file]);
            }
        });
    });

    monitor.on('removed', (file) => {
        console.log('removing file:', file);
    });
});
