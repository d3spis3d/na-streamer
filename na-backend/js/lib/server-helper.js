export function createStreamersUpdate(streamers) {
    return function(streamerId, stream) {
        streamers[streamerId] = stream;
    };
}

export function setClientList(clients) {
    return function(data) {
        console.log('received binary data');
        clients.forEach(client => {
            client.res.write(data);
        });
    };
}

export function setTrackListingMap(tracks, filesByStreamer, streamerId) {
    return function(data) {
        for (let artist in data) {
            tracks[artist] = tracks[artist] || {};
            for (let albumName in data[artist]) {
                tracks[artist][albumName] = tracks[artist][albumName] || {};
                const album = data[artist][albumName];
                for (let track in album) {
                    filesByStreamer[album[track].id] = streamerId;
                    tracks[artist][albumName][track] = album[track];
                }
            }
        }
    };
}
