import {ActionWithPayload } from '../types/index';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_ACTIVE_MEDIA_STATE = 'SET_ACTIVE_MEDIA_STATE';

// ------------------------------------
// Actions
// ------------------------------------
export function setActiveMediaState(zoneId : string, mediaStateId : string){

    return {
        type: SET_ACTIVE_MEDIA_STATE,
        payload: {
            zoneId,
            mediaStateId
        }
    };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    activeMediaStateByZone : {}
};

export default function(state : Object = initialState, action : ActionWithPayload) {

    switch (action.type) {

        case SET_ACTIVE_MEDIA_STATE: {

            let newState : any = Object.assign({}, state);

            let { zoneId, mediaStateId } = action.payload;
            newState.activeMediaStateByZone[zoneId] = mediaStateId;

            console.log(newState);

            return newState;
        }
    }

    return state;
}


// ------------------------------------
// Selectors
// ------------------------------------
export function getActiveMediaStateId(state : any, zoneId : string) {

    const activeMediaStateByZone = state.activeMediaStates.activeMediaStateByZone;
    const activeMediaStateId = activeMediaStateByZone[zoneId];
    return activeMediaStateId;
}

