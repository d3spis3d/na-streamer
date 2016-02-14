import {FETCH_PLAYING, RECEIVE_PLAYING} from '../actions/actions';

const initialState = {
    loadingPlaying: false,
    playing: null
};

export default function(state = initialState, action) {
    switch (action.type) {
    case FETCH_PLAYING:
        return Object.assign({}, state, {
            loadingPlaying: true,
            playing: null
        });
    case RECEIVE_PLAYING:
        return Object.assign({}, state, {
            loadingPlaying: false,
            playing: action.playing
        });
    default:
        return state;
    }
}
