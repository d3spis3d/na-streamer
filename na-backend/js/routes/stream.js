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
                let indices = [];
                clients.forEach((client, i) => {
                    if (client.ip === req.ip) {
                        indices.push(i);
                    }
                });
                indices.forEach(i => {
                    clients.splice(i);
                });
            });
        };
    }
}
