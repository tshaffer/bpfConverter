import {
    ActionWithPayload,
    StateMachineShape
} from '../types/index';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_PLAYBACK_STATE = 'SET_PLAYBACK_STATE';

// ------------------------------------
// Actions
// ------------------------------------
export function setPlaybackState(playbackState : string){

    return {
        type: SET_PLAYBACK_STATE,
        payload: playbackState
    };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState : StateMachineShape = {
    playbackState: 'active',
};

export default function(state : StateMachineShape = initialState, action : ActionWithPayload) {

    switch (action.type) {

        case SET_PLAYBACK_STATE: {

            let newState = {
                ...state,
                playbackState: action.payload
            };

            console.log(newState);
            return newState;
        }
    }

    return state;
}


