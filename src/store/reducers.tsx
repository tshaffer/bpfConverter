import {
    ArState,
} from '../types';

import {combineReducers} from 'redux';
import { bsDmReducer } from '@brightsign/bsdatamodel';
import stateMachineReducer from './stateMachine';
import activeMediaStatesReducer from './activeMediaStates';
import mrssDataFeedItemReducer from './mrssDataFeedItems';

import dataFeedsReducer from './dataFeeds';

const rootReducer = combineReducers<ArState>({
    bsdm : bsDmReducer,
    stateMachine: stateMachineReducer,
    activeMediaStates : activeMediaStatesReducer,
    dataFeeds: dataFeedsReducer,
    mrssDataFeedItems : mrssDataFeedItemReducer,
});

export default rootReducer;
