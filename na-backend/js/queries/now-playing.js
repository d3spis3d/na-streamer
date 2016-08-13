export default function(db, channel) {
    return db.query('select from Now_Playing where channel = :channel limit 1', {
        params: {
            channel: channel
        }
    })
    .then(results => {
        const nowPlaying = results[0];
        return {
            title: nowPlaying.title,
            album: nowPlaying.album,
            artist: nowPlaying.artist
        };
    });
}
