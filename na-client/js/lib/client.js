import {BinaryClient} from 'binaryjs';
import Rx from 'rx';

import openStreamToServer from './streams/open-stream-to-server';

export function startClient(options) {
    const client = BinaryClient(`ws://${options.host}:${options.port}`);

    clientConnect = Rx.Observable.fromEvent(client, 'on');
    clientDisconnect = Rx.Observable.fromEvent(client, 'close');
    clientError = Rx.Observable.fromEvent(client, 'err');

    return {
      client,
      clientConnect,
      clientDisconnect,
      clientError
    };
}
