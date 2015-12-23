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
let sendFileData;

function createStreamToServer(stream) {
    return function(hostedFileData) {
        stream.write(hostedFileData);
    };
}
const client = BinaryClient('ws://localhost:9000');

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

function buildFileInfoForBackend(map, track) {
    map[track.artist] = map[track.artist] || {};
    map[track.artist][track.album] = map[track.artist][track.album] || {};
    map[track.artist][track.album][track.number] = {id: track.id, title: track.title};
    return map;
}

function reduceAndMemoize(memo, memoKey, memoValue) {
    return function(array, reduceFunction, initial) {
        return array.reduce(function(previous, current) {
            memo[current[memoKey]] = current[memoValue];
            return reduceFunction(previous, current);
        });
    };
}

const processFile = reduceAndMemoize(filesById, 'id', 'file');

dir.files(options.dir, (err, files) => {
    if (err) {
        console.log(err);
        return;
    }

    if (files) {
        const hostedFiles = processFiles(files, buildFileInfoForBackend, {});
        sendFileData(hostedFiles);
    }
});

watch.createMonitor(options.dir, (monitor) => {
    monitor.on('created', (file) => {
        fs.lstat(file, (err, stat) => {
            if (stat.isFile()) {
                const hostedFiles = processFiles(files, buildFileInfoForBackend, {});
                sendFileData(hostedFiles);
            }
        });
    });

    monitor.on('removed', (file) => {
        console.log('removing file:', file);
    });
});
