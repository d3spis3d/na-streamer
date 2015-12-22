import {BinaryServer} from 'binaryjs';

const server = BinaryServer({port: 9000});

server.on('connection', function(client) {
    client.on('stream', function(stream) {
        stream.on('data', function(data) {
            console.log(data);
        });
    });
});
