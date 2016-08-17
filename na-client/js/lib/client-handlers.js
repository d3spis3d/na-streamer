import openStreamToServer from './streams/open-stream-to-server';

export default function(client, filesById, options, key, tracks) {
    client.clientConnect.subscribe(function() {
        openStreamToServer(filesStore, options.dir, client.client, key, tracks);
    });

    client.clientDisconnect.subscribe(function() {
        console.log('connection closed');
    });

    client.clientError.subscribe(function(err) {
         console.log('error: ', err);
    });
}
