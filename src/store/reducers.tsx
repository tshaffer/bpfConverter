import {combineReducers} from 'redux';
import { DataFeedState } from '../types/index';

import dataFeedsReducer from './dataFeeds';

const rootReducer = combineReducers<DataFeedState>({
    dataFeeds: dataFeedsReducer,
});

export default rootReducer;
