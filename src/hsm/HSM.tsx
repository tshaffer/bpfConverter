import {
  ArEventType,
  HSMStateData,
} from '../types';

import {BSP} from '../app/bsp';

export class HSM {

  bsp: BSP;

  topState: HState;
  activeState: HState;
  constructorHandler: Function;
  initialPseudoStateHandler: Function;

  constructor() {
    this.topState = null;
    this.activeState = null;
    this.constructorHandler = null;
    this.initialPseudoStateHandler = null;
  }

  constructorFunction() {
    this.constructorHandler();
  }

  initialize() {

    const stateData: HSMStateData = {nextState: null};

    // empty event used to get super states
    const emptyEvent: ArEventType = {EventType: 'EMPTY_SIGNAL'};

    // entry event
    const entryEvent: ArEventType = {EventType: 'ENTRY_SIGNAL'};

    // init event
    const initEvent: ArEventType = {EventType: 'INIT_SIGNAL'};

    // execute initial transition
    // this.activeState = this.initialPseudoStateHandler(...arguments);
    const [a] = Array.prototype.slice.call(arguments);
    this.activeState = this.initialPseudoStateHandler(a);

    // if there is no activeState, the playlist is empty
    if (this.activeState == null) return;

    let activeState = this.activeState;

    // start at the top state
    if (this.topState == null) {
      debugger;
    }
    let sourceState = this.topState;

    while (true) {

      const entryStates = [];
      let entryStateIndex = 0;

      entryStates[0] = activeState;                                                   // target of the initial transition

      let status = this.activeState.HStateEventHandler(emptyEvent, stateData);        // send an empty event to get the super state

      activeState = stateData.nextState;
      this.activeState = stateData.nextState;

      while (activeState.id !== sourceState.id) {                                      // walk up the tree until the current source state is hit
        entryStateIndex = entryStateIndex + 1;
        entryStates[entryStateIndex] = activeState;
        status = this.activeState.HStateEventHandler(emptyEvent, stateData);
        activeState = stateData.nextState;
        this.activeState = stateData.nextState;
      }

      //        activeState = entryStates[0];                                                 // restore the target of the initial transition

      while (entryStateIndex >= 0) {                                                  // retrace the entry path in reverse (desired) order
        const entryState = entryStates[entryStateIndex];
        status = entryState.HStateEventHandler(entryEvent, stateData);
        entryStateIndex = entryStateIndex - 1;
      }

      sourceState = entryStates[0];                                                    // new source state is the current state

      status = sourceState.HStateEventHandler(initEvent, stateData);
      if (status !== 'TRANSITION') {
        this.activeState = sourceState;
        return;
      }

      activeState = stateData.nextState;
      this.activeState = stateData.nextState;
    }
  }

  Dispatch(event: ArEventType) {

    // if there is no activeState, the playlist is empty
    if (this.activeState == null) {
      return;
    }

    const stateData: HSMStateData = {nextState: null};

    // empty event used to get super states
    const emptyEvent: ArEventType = {EventType: 'EMPTY_SIGNAL'};

    // entry event
    const entryEvent: ArEventType = {EventType: 'ENTRY_SIGNAL'};

    // init event
    const initEvent: ArEventType = {EventType: 'INIT_SIGNAL'};

    // exit event
    const exitEvent: ArEventType = {EventType: 'EXIT_SIGNAL'};

    let t = this.activeState;                                                      // save the current state

    let status = 'SUPER';
    let s = null;
    while (status === 'SUPER') {                                                 // process the event hierarchically
      s = this.activeState;
      status = s.HStateEventHandler(event, stateData);
      this.activeState = stateData.nextState;
    }

    if (status === 'TRANSITION') {
      let path = [];

      path[0] = this.activeState;                                                // save the target of the transition
      path[1] = t;                                                            // save the current state

      while (t.id !== s.id) {                                                  // exit from the current state to the transition s
        status = t.HStateEventHandler(exitEvent, stateData);
        if (status === "HANDLED") {
          status = t.HStateEventHandler(emptyEvent, stateData);
        }
        t = stateData.nextState;
      }

      t = path[0];                                                            // target of the transition

      // s is the source of the transition
      let ip;
      if (s.id === t.id) {                                                     // check source == target (transition to self)
        status = s.HStateEventHandler(exitEvent, stateData);                // exit the source
        ip = 0;
      } else {
        status = t.HStateEventHandler(emptyEvent, stateData);               // superstate of target
        t = stateData.nextState;
        if (s.id === t.id) {                                                 // check source == target->super
          ip = 0;                                                         // enter the target
        } else {
          status = s.HStateEventHandler(emptyEvent, stateData);           // superstate of source
          if (stateData.nextState.id === t.id) {                           // check source->super == target->super
            status = s.HStateEventHandler(exitEvent, stateData);        // exit the source
            ip = 0;                                                     // enter the target
          }
          else {
            if (stateData.nextState.id === path[0].id) {                 // check source->super == target
              status = s.HStateEventHandler(exitEvent, stateData);    // exit the source
            }
            else {                                                      // check rest of source == target->super->super and store the entry path along the way
              let iq = 0;                                             // indicate LCA not found
              ip = 1;                                                 // enter target and its superstate
              path[1] = t;                                            // save the superstate of the target
              t = stateData.nextState;                                // save source->super
              // get target->super->super
              status = path[1].HStateEventHandler(emptyEvent, stateData);
              while (status === "SUPER") {
                ip = ip + 1;
                path[ip] = stateData.nextState;                     // store the entry path
                if (stateData.nextState.id === s.id) {                // is it the source?
                  iq = 1;                                         // indicate that LCA found
                  ip = ip - 1;                                    // do not enter the source
                  status = "HANDLED";                             // terminate the loop
                }
                else {                                              // it is not the source; keep going up
                  status = stateData.nextState.HStateEventHandler(emptyEvent, stateData);
                }
              }

              if (iq === 0) {                                           // LCA not found yet
                status = s.HStateEventHandler(exitEvent, stateData);// exit the source

                // check the rest of source->super == target->super->super...
                iq = ip;
                status = "IGNORED";                                 // indicate LCA not found
                while (iq >= 0) {
                  if (t.id === path[iq].id) {                      // is this the LCA?
                    status = "HANDLED";                         // indicate LCA found
                    ip = iq - 1;                                // do not enter LCA
                    iq = -1;                                    // terminate the loop
                  }
                  else {
                    iq = iq - 1;                                 // try lower superstate of target
                  }
                }

                if (status !== "HANDLED") {                          // LCA not found yet?

                  // check each source->super->... for each target->super...
                  status = "IGNORED";                             // keep looping
                  while (status !== "HANDLED") {
                    status = t.HStateEventHandler(exitEvent, stateData);
                    if (status === "HANDLED") {
                      status = t.HStateEventHandler(emptyEvent, stateData);
                    }
                    t = stateData.nextState;                    // set to super of t
                    iq = ip;
                    while (iq > 0) {
                      if (t.id === path[iq].id) {              // is this the LCA?
                        ip = iq - 1;                        // do not enter LCA
                        iq = -1;                            // break inner
                        status = "HANDLED";                 // break outer
                      }
                      else {
                        iq = iq - 1;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      // retrace the entry path in reverse (desired) order...
      while (ip >= 0) {
        status = path[ip].HStateEventHandler(entryEvent, stateData);        // enter path[ip]
        ip = ip - 1;
      }

      t = path[0];                                                            // stick the target into register */
      this.activeState = t;                                                   // update the current state */

      // drill into the target hierarchy...
      status = t.HStateEventHandler(initEvent, stateData);
      this.activeState = stateData.nextState;

      while (status === "TRANSITION") {
        ip = 0;
        path[0] = this.activeState;
        status = this.activeState.HStateEventHandler(emptyEvent, stateData);// find superstate
        this.activeState = stateData.nextState;
        while (this.activeState.id !== t.id) {
          ip = ip + 1;
          path[ip] = this.activeState;
          status = this.activeState.HStateEventHandler(emptyEvent, stateData);// find superstate
          this.activeState = stateData.nextState;
        }
        this.activeState = path[0];

        while (ip >= 0) {
          status = path[ip].HStateEventHandler(entryEvent, stateData);
          ip = ip - 1;
        }

        t = path[0];

        status = t.HStateEventHandler(initEvent, stateData);
      }
    }

    this.activeState = t;                                                       // set the new state or restore the current state
  }
}

export class HState {

  topState: null;
  HStateEventHandler: Function;
  stateMachine: HSM;
  superState: HState;
  id: string;

  constructor(stateMachine: HSM, id: string) {
    this.topState = null;

    this.HStateEventHandler = null;                                             // filled in by HState instance

    this.stateMachine = stateMachine;

    this.superState = null;                                                     // filled in by HState instance
    this.id = id;
  }
}

export function STTopEventHandler(_: ArEventType, stateData: HSMStateData) {

  stateData.nextState = null;
  return "IGNORED";
}

