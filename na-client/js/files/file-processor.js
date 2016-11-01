import extractTrack from './extract-track';
import buildFileInfoForBackend from './build-file-info';
import reduceAndMemoize from '../lib/reduce-and-memoize';

const CLIENT_KEYFILE = '.clientkey';
const DS_STORE = '.DS_Store';

export default function fileProcessor(filesById, musicDir, files) {
    const tracks = files.filter(file => {
        if (file.indexOf(CLIENT_KEYFILE) !== -1) {
            return false;
        }
        if (file.indexOf(DS_STORE) !== -1) {
            return false;
        }
        return true;
    })
    .map(extractTrack(musicDir));

    const processTracks = reduceAndMemoize(filesById, 'id', 'file');
    return processTracks(tracks, buildFileInfoForBackend, {});
}
