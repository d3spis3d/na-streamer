export const getStream = {
    url: '/stream',
    generateHandler: function(clients) {
        return function(req, res) {
            const headers = { "Content-Type": "audio/mpeg", "Connection": "close", "Transfer-Encoding": "identity"};
            if (!res.headers) {
                res.writeHead(200, headers);
            }
            clients.push({res});
        };
    }
}
