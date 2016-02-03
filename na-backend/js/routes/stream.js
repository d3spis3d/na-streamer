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
            clients.push({
                ip: req.ip,
                res: res
            });
            populateQueue();

            req.connection.on('close', () => {
                clients = clients.filter(client => client.ip !== req.ip);
            });
        };
    }
}
