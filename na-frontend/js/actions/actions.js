export const FETCH_QUEUE = 'FETCH_QUEUE';
export const UPDATE_QUEUE = 'UPDATE_QUEUE';
export const RECEIVE_QUEUE = 'RECEIVE_QUEUE';

export function fetchQueue() {
    return {
        type: FETCH_QUEUE
    };
}

export function receiveQueue(queue) {
    return {
        type: RECEIVE_QUEUE,
        queue: queue
    };
}

export function updateQueue() {
    return function(dispatch) {
        dispatch(fetchQueue);

        return fetch('/queue')
        .then(response => response.json())
        .then(json => dispatch(receiveQueue(json)));
    };
}
