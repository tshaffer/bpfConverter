import {
    ArState
} from '../types';

import {combineReducers} from 'redux';
import { bsDmReducer } from '@brightsign/bsdatamodel';
import { DataFeedState } from '../types/index';
import stateMachineReducer from './stateMachine';
import activeMediaStatesReducer from './activeMediaStates';

import dataFeedsReducer from './dataFeeds';

const rootReducer = combineReducers<ArState>({
    bsdm : bsDmReducer,
    stateMachine: stateMachineReducer,
    activeMediaStates : activeMediaStatesReducer,
    dataFeeds: dataFeedsReducer,
});

export default rootReducer;
