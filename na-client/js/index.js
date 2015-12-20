import dir from 'node-dir';
import watch from 'watch';
import path from 'path';
import commandLineArgs from 'command-line-args';
import uuid from 'node-uuid';

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

dir.files(options.dir, function(err, files) {
    if (err) {
        console.log(err);
        return;
    }

    if (files) {
        files.forEach((file) => {
            processFile(file);
        });
    }
    console.log(hostedFiles);
    console.log(filesById);
});

watch.createMonitor(options.dir, function(monitor) {
    monitor.on('created', function(file) {
        console.log('adding a new file:', file);
    });

    monitor.on('removed', function(file) {
        console.log('removing file:', file);
    });
});
