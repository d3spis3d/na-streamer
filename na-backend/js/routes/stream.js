export const getStream = {
    url: '/stream',
    generateHandler: function(clients, songQueue, populateQueue) {
        return function(req, res) {
            const headers = {
                "Content-Type": "audio/mpeg",
                "Connection": "close",
                "Transfer-Encoding": "identity"
            };

            if (!res.headers) {
                res.writeHead(200, headers);
            }
            clients.push({res});

            if (songQueue.length === 0) {
                populateQueue();
            }
        };
    }
}
