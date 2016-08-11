import probe from 'node-ffprobe';
import Rx from 'rx';
import watch from 'watch';
import promisify from 'promisify-node';

import {createWriteStream} from '../helper';
import {setupFileWatcher} from '../files/files-processing'
import createTrackResponse from './create-track-response';

const trackProbe = promisify(probe);

export default function(filesStore, musicDir, client, key, tracks) {
    console.log('opened connection');
    const stream = client.createStream();
    const sendFileData = createWriteStream(stream);
    const streamTrack = createTrackResponse(filesStore, sendFileData, trackProbe);

    sendFileData({
      key: key,
      tracks: tracks
    });

    const streamedData = Rx.Observable.fromEvent(stream, 'data');

    const trackRequests = streamedData.filter(data => typeof data === 'string' || data instanceof String);
    trackRequests.subscribe(streamTrack);

    watch.createMonitor(musicDir, setupFileWatcher(sendFileData, processTracks, musicDir, key));
}
