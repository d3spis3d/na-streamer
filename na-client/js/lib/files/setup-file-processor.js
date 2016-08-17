const CLIENT_KEYFILE = '.clientkey';

export default function(processTracks, musicDir, key, files) {
    const tracks = files
        .filter(file => file.indexOf(CLIENT_KEYFILE) === -1)
        .map(extractTrack(musicDir));
    return processTracks(tracks, buildFileInfoForBackend, {});
}
