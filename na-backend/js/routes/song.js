export const getSongByUUID = {
    url: '/song/:uuid',
    generateHandler: function(filesByStreamer, streamers) {
        return function(req, res) {
            const streamerId = filesByStreamer[req.params.uuid];
            const stream = streamers[streamerId];
            stream.write(req.params.uuid);
            res.sendStatus(200);
        };
    }
}
