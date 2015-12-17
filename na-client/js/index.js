import dir from 'node-dir';
import path from 'path';

const dirPath = '/path/to/music';

dir.files(dirPath, function(err, files) {
    if (err) {
        console.log(err);
        return;
    }

    if (files) {
        files.forEach((file) => {
            console.log('file:', file);
            const [artist, album, songFile] = path.relative(dirPath, file).split(path.sep);
            console.log('artist:', artist);
            console.log('album:', album);
            console.log('song file:', songFile);
        });
    }
});
