import path from 'path';

import uuid from 'node-uuid';

export default function(musicDir) {
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

export function createTrackData(songFile) {
    const [number, song] = songFile.split('-');
    const [title, ] = song.split('.');
    const id = uuid.v4();
    return {
        number, title, id
    };
}

export function buildFileInfoForBackend(map, track) {
    map[track.artist] = map[track.artist] || {};
    map[track.artist][track.album] = map[track.artist][track.album] || {};
    map[track.artist][track.album][track.number] = {id: track.id, title: track.title};
    return map;
}
