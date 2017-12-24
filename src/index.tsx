import thunkMiddleware from 'redux-thunk';

import { createStore, applyMiddleware } from 'redux';

import reducers from './store/reducers';

import { bsp } from './app/bsp';

const store = createStore(
    reducers,
    applyMiddleware(
        thunkMiddleware,
    ),
);

bsp.initialize(store);
