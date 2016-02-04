export const getNowPlaying = {
    url: '/playing',
    generateHandler: function(db) {
        return function(req, res) {
            return db.query('select from Now_Playing limit 1')
            .then(results => {
                const nowPlaying = results[0];
                return {
                    title: nowPlaying.title,
                    album: nowPlaying.album,
                    artist: nowPlaying.artist
                };
            })
            .then(nowPlaying => {
                res.status(200).send(JSON.stringify(nowPlaying));
            });
        };
    }
}
