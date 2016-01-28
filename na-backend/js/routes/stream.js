export const getStream = {
    url: '/stream',
    generateHandler: function(clients, populateQueue) {
        return function(req, res) {
            const headers = {
                "Content-Type": "audio/mpeg",
                "Transfer-Encoding": "identity"
            };

            if (!res.headers) {
                res.writeHead(200, headers);
            }
            clients.push({res});
            populateQueue();
        };
    }
}
