import path from 'path';
import crypto from 'crypto';

import uuid from 'node-uuid';

export default function extractTrack(musicDir) {
    return function(file) {
        const [genre, artist, album, songFile] = path.relative(musicDir, file).split(path.sep);
        const id = crypto.createHash('sha256').update(file).digest('hex');
        const [number, song] = songFile.split('-');
        const [title, ] = song.split('.');
        return {
            genre,
            artist,
            album,
            file,
            number,
            title,
            id
        };
    }
}
