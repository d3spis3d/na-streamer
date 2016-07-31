export const getStream = {
    url: '/api/stream',
    generateHandler: function(clients, populateQueue) {
        return function(req, res) {
            const headers = {
                "Content-Type": "audio/mpeg",
                "Transfer-Encoding": "identity"
            };

            if (!res.headers) {
                res.writeHead(200, headers);
            }
            clients.add({
                ip: req.ip,
                res: res
            });
            populateQueue();

            req.connection.on('close', () => {
                clients.removeByIp(req.ip);
            });
        };
    }
}
