import probe from 'node-ffprobe';
import Rx from 'rx';

import {createWriteStream} from '../helper';
import setupFilesProcessing from '../files/setup-files-processing';
import createTrackResponse from './create-track-response';

export default function(filesStore, musicDir, client, key) {
    console.log('opened connection');
    const stream = client.createStream();
    const sendFileData = createWriteStream(stream);
    const streamTrack = createTrackResponse(filesStore, sendFileData, probe);

    const streamedData = Rx.Observable.fromEvent(stream, 'data');

    const trackRequests = streamedData.filter(data => typeof data === 'string' || data instanceof String);
    trackRequests.subscribe(streamTrack);

    setupFilesProcessing(filesStore, sendFileData, musicDir, key);
}
