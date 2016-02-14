import { combineReducers } from 'redux';

import queue from './queue';
import playing from './playing';

const rootReducer = combineReducers({
    queue,
    playing
});

export default rootReducer;
