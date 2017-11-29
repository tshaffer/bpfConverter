import {
    ArState,
} from '../types';

import {combineReducers} from 'redux';
import { bsDmReducer } from '@brightsign/bsdatamodel';

const rootReducer = combineReducers<ArState>({
    bsdm : bsDmReducer,
});

export default rootReducer;
