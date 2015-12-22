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

const hostedFiles = {};
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

function processFile(file) {
    const [artist, album, songFile] = path.relative(options.dir, file).split(path.sep);
    hostedFiles[artist] = hostedFiles[artist] || {};
    hostedFiles[artist][album] = hostedFiles[artist][album] || [];
    const track = createTrackData(songFile);
    hostedFiles[artist][album].push(track);
    filesById[track.id] = file;
}

dir.files(options.dir, (err, files) => {
    if (err) {
        console.log(err);
        return;
    }

    if (files) {
        files.forEach((file) => {
            processFile(file);
        });
        sendFileData(hostedFiles);
    }
});

watch.createMonitor(options.dir, (monitor) => {
    monitor.on('created', (file) => {
        fs.lstat(file, (err, stat) => {
            if (stat.isFile()) {
                processFile(file);
            }
        });
    });

    monitor.on('removed', (file) => {
        console.log('removing file:', file);
    });
});
