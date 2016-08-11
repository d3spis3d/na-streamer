import uuid from 'node-uuid';

export const getChannels = {
    url: '/api/channel',
    generateHandler: function(db, listChannels) {
        return function(req, res) {
            return listChannels(db)
            .then(results => {
                res.send(JSON.stringify(results));
            });
        };
    }
}

export const createChannel = {
    url: '/api/channel',
    generateHandler: function(db, createQuery) {
        return function(req, res) {
            const key = uuid.v4().substring(0, 6);
            return createQuery(db, req.body.title, key)
            .then(() => {
                res.sendStatus(200);
            });
        };
    }
}

export const deleteChannel = {
    url: '/api/channel/:key',
    generateHandler: function(db, deleteQuery) {
        return function(req, res) {
            return deleteQuery(db, req.params.key)
            .then(() => {
                res.sendStatus(200);
            });
        };
    }
}
