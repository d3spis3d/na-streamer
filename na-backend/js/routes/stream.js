export const getStream = {
    url: '/api/stream/:channel',
    generateHandler: function(clients, populateQueueForChannel) {
        return function(req, res) {
            const headers = {
                "Content-Type": "audio/mpeg",
                "Transfer-Encoding": "identity"
            };

            if (!res.headers) {
                res.writeHead(200, headers);
            }
            clients.addToChannel({
                ip: req.ip,
                res: res
            }, req.params.channel);

            populateQueueForChannel(req.params.channel);

            req.connection.on('close', () => {
                clients.removeByIpFromChannel(req.ip, req.params.channel);
            });
        };
    }
}
