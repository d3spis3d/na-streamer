export function setupClients() {
    const clients = [];
    return {
        add: function(client) {
            clients.push(client);
        },
        count: function() {
            return clients.length;
        },
        writeToAll: function(data) {
            clients.forEach(client => {
                client.res.write(data);
            });
        },
        removeByIp: function(ip) {
            const indices = [];
            clients.forEach((client, i) => {
                if (client.ip === ip) {
                    indices.push(i);
                }
            });
            indices.forEach(i => {
                clients.splice(i, 1);
            });
        },
        get: function() {
            return clients;
        }
    };
}

export function setupStreamers() {
    const streamers = {};
    return {
        add: function(streamerId, stream) {
            streamers[streamerId] = stream;
        },
        get: function(streamerId) {
            return streamers[streamerId];
        }
    };
}
