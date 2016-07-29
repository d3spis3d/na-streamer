export const getClients = {
    url: '/api/clients',
    generateHandler: function(clients) {
        return function(req, res) {
            res.status(200).send(JSON.stringify({
                count: clients.count()
            }));
        };
    }
}
