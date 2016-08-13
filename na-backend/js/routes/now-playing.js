export const getNowPlaying = {
    url: '/api/playing/:channel',
    generateHandler: function(db, nowPlayingQuery) {
        return function(req, res) {
            return nowPlayingQuery(db, req.params.channel)
            .then(nowPlaying => {
                res.status(200).send(JSON.stringify(nowPlaying));
            });
        };
    }
}
