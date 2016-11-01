export default function buildFileInfoForBackend(map, track) {
    map[track.genre] = map[track.genre] || {};
    map[track.genre][track.artist] = map[track.genre][track.artist] || {};
    map[track.genre][track.artist][track.album] = map[track.genre][track.artist][track.album] || {};
    map[track.genre][track.artist][track.album][track.number] = {id: track.id, title: track.title};
    return map;
}
