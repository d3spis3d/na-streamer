import dir from 'node-dir';
import watch from 'watch';
import path from 'path';
import commandLineArgs from 'command-line-args';

const cli = commandLineArgs([
    {
        name: 'dir',
        alias: 'd',
        type: String
    }
]);
const options = cli.parse();

function processFile(file) {
    console.log('file:', file);
    const [artist, album, songFile] = path.relative(options.dir, file).split(path.sep);
    console.log('artist:', artist);
    console.log('album:', album);
    console.log('song file:', songFile);
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
});

watch.createMonitor(options.dir, function(monitor) {
    monitor.on('created', function(file) {
        processFile(file);
    });

    monitor.on('removed', function(file) {
        processFile(file);
    });
});
