import { combineReducers } from 'redux';

import {FETCH_QUEUE, RECEIVE_QUEUE} from '../actions/actions';

const initialState = {
    loadingQueue: false,
    queue: []
};

function queue(state = initialState, action) {
    switch (action.type) {
    case FETCH_QUEUE:
        return Object.assign({}, state, {
            loadingQueue: true,
            queue: []
        });
    case RECEIVE_QUEUE:
        return Object.assign({}, state, {
            loadingQueue: false,
            queue: action.queue
        });
    default:
        return state;
    }
}

const rootReducer = combineReducers({
    queue
});

export default rootReducer;
