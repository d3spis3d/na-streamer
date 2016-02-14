export const FETCH_PLAYING = 'FETCH_PLAYING';
export const RECEIVE_PLAYING = 'RECEIVE_PLAYING';
export const UPDATE_PLAYING = 'UPDATE_PLAYING';

export function fetchPlaying() {
    return {
        type: FETCH_PLAYING
    };
}

export function receivePlaying(playing) {
    return {
        type: RECEIVE_PLAYING,
        playing: playing
    };
}

export function updatePlaying() {
    return function(dispatch) {
        dispatch(fetchPlaying());

        return fetch('/playing')
        .then(response => response.json())
        .then(json => dispatch(receivePlaying(json)));
    };
}
