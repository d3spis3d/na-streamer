export const getQueue = {
    url: '/api/queue/:channel',
    generateHandler: function(db, listQueueForChannel) {
        return function(req, res) {
            return listQueueForChannel(db, req.params.channel)
            .then(results => {
                res.send(JSON.stringify(results));
            });
        };
    }
}

export const addToQueue = {
    url: '/api/queue/:channel',
    generateHandler: function(db, addToChannelQueue) {
        return function(req, res) {
            return addToChannelQueue(db, req.body.rid, req.params.channel)
            .then(() => {
                res.sendStatus(200);
            });
        };
    }
}

export const removeFromQueue = {
    url: '/api/queue/:channel',
    generateHandler: function(db, removeFromChannelQueue) {
        return function(req, res) {
            return removeFromChannelQueue(db, req.body.rid, req.params.channel)
            .then(() => {
                res.sendStatus(200);
            });
        };
    }
}
