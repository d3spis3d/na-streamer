export function setupClients() {
    const clients = {};
    return {
        addToChannel: function(client, channel) {
            if (clients[channel]) {
                clients[channel].push(client);
            } else {
                clients[channel] = [client];
            }
        },
        count: function() {
            const clientCount = {};
            Object.keys(clients).forEach(channel => {
                clientCount[channel] = clients[channel].length;
            });
            return clientCount;
        },
        writeToAllForChannel: function(data, channel) {
            clients[channel].forEach(client => {
                client.res.write(data);
            });
        },
        removeByIpFromChannel: function(ip, channel) {
            const indices = [];
            clients[channel].forEach((client, i) => {
                if (client.ip === ip) {
                    indices.push(i);
                }
            });
            indices.forEach(i => {
                clients[channel].splice(i, 1);
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
