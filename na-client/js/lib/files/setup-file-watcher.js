import fs from 'fs';
import Rx from 'rx';
import watch from 'watch';

import extractTrack, {buildFileInfoForBackend} from './files-parsing';
import {createWriteStream} from '../helper';

export default function(client, processTracks, musicDir, key) {
  //need to make sure this works on client disconnect reconnect
  //maybe create monitor then on client connect setup the streams?
    client.clientConnect.subscribe(function() {
        watch.createMonitor(musicDir, function(monitor) {
            Rx.Observable.fromEvent(monitor, 'created')
                .filter((file) => {
                    return fs.lstatSync(file).isFile();
                })
                .bufferWithTime(10000)
                .map((files) => {
                    const tracks = files.map(extractTrack(musicDir));
                    return processTracks(tracks, buildFileInfoForBackend, {});;
                })
                .subscribe((tracks) => {
                    if (Object.keys(tracks).length > 0) {
                        const stream = client.client.createStream();
                        const sendFileData = createWriteStream(stream);
                        sendFileData({
                            key: key,
                            tracks: tracks
                        });
                        stream.end();
                        stream.destroy();
                    }
                });

            monitor.on('removed', (file) => {
                console.log('removing file:', file);
            });
        });
    });
}
