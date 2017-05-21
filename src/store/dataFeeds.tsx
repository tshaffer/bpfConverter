import { DataFeedState } from '../types/index';
import {ActionWithPayload } from '../types/index';

import { DataFeed } from '../entities/dataFeed';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_DATA_FEED = 'ADD_DATA_FEED';
export const UPDATE_DATA_FEED = 'UPDATE_DATA_FEED';

// ------------------------------------
// Actions
// ------------------------------------
export function addDataFeed(dataFeed : DataFeed){

    return {
        type: ADD_DATA_FEED,
        payload: {
            dataFeed,
        }
    };
}

export function updateDataFeed(dataFeed : DataFeed){

    return {
        type: UPDATE_DATA_FEED,
        payload: {
            dataFeed,
        }
    };
}


// ------------------------------------
// Reducer
// ------------------------------------
const initialState : DataFeedState = {
    dataFeedsById : {}
};

export default function(state : DataFeedState = initialState, action : ActionWithPayload) {

    switch (action.type) {

        case ADD_DATA_FEED: {

            let newState : DataFeedState = {...state};

            const dataFeed : DataFeed = action.payload.dataFeed;

            newState.dataFeedsById[dataFeed.id] = dataFeed;

            console.log(newState);

            return newState;
        }

        case UPDATE_DATA_FEED: {

            let newState : DataFeedState = {...state};

            const dataFeed : DataFeed = action.payload.dataFeed;

            newState.dataFeedsById[dataFeed.id] = dataFeed;

            console.log(newState);

            return newState;
        }

    }

    return state;
}


