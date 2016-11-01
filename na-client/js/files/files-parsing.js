import path from 'path';
import crypto from 'crypto';

import uuid from 'node-uuid';

export default function(musicDir) {
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

export function buildFileInfoForBackend(map, track) {
    map[track.genre] = map[track.genre] || {};
    map[track.genre][track.artist] = map[track.genre][track.artist] || {};
    map[track.genre][track.artist][track.album] = map[track.genre][track.artist][track.album] || {};
    map[track.genre][track.artist][track.album][track.number] = {id: track.id, title: track.title};
    return map;
}
