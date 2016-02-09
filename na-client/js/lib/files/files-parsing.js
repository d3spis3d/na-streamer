import path from 'path';
import crypto from 'crypto';

import uuid from 'node-uuid';

export default function(musicDir, filesStore) {
    return function(file) {
        const [genre, artist, album, songFile] = path.relative(musicDir, file).split(path.sep);
        const id = crypto.createHash('sha256').update(file).digest('hex');
        const {number, title} = createTrackData(songFile);
        filesStore[id] = file;
        return {
            genre,
            artist,
            album,
            number,
            title,
            id
        };
    }
}

export function createTrackData(songFile) {
    const [number, song] = songFile.split('-');
    const [title, ] = song.split('.');
    return {
        number,
        title
    };
}
