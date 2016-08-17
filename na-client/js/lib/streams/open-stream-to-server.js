import probe from 'node-ffprobe';
import Rx from 'rx';

import promisify from 'promisify-node';

import {createWriteStream} from '../helper';
import {setupFileWatcher} from '../files/files-processing'
import createTrackResponse from './create-track-response';

const trackProbe = promisify(probe);

export default function(filesStore, musicDir, client, key, tracks) {
    console.log('opened connection');
    //this stream should just be for track requests and maybe initial track data
    const stream = client.createStream();
    const sendFileData = createWriteStream(stream);
    const streamTrack = createTrackResponse(filesStore, sendFileData, trackProbe);

    sendFileData({
      key: key,
      tracks: tracks
    });

    const streamedData = Rx.Observable.fromEvent(stream, 'data');

    //when receive track request create a new stream and send track, then close stream
    const trackRequests = streamedData.filter(data => typeof data === 'string' || data instanceof String);
    trackRequests.subscribe(streamTrack);
}
