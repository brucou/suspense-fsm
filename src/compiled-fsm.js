import { destructureEvent, INIT_EVENT, NO_OUTPUT } from "kingly"
import {  eventMonikers, stateMonikers, runOperation, renderSucceeded, renderError, renderFallback, startTimer } from "./properties"

const [INIT, SUSPENSE, PENDING, SPINNING, ERROR, DONE] = stateMonikers;
const [START, TIMER_EXPIRED, SUCCEEDED, FAILED] = eventMonikers;

// State update
// Basically {a, b: {c, d}}, [{b:{e}]} -> {a, b:{e}}
// All Object.assign caveats apply
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
function updateState(extendedState, extendedStateUpdates) {
  const extendedStateCopy = Object.assign({}, extendedState);
  return extendedStateUpdates.reduce((acc, x) => Object.assign(acc, x), extendedStateCopy);
}

// TODO: add in contracts that no event can be called INIT_EVENT or undefined!!
// TODO: add in contracts that no state can be called INIT_STATE
const _EVENTLESS_ = "undefined";
const initialControlState = INIT;
const initialExtendedState = {};
// This is to prevent infinite loops (possible due to eventless self-transitions)
const maxLoopCount = 1000;
const compoundStates = { [SUSPENSE]: true };
// TODO: what about INIT_STATE nok initial transition??
const eventlessStates = {};

function isCompoundState(controlState) {
  return compoundStates[controlState]
}

function isEventlessState(controlState) {
  return eventlessStates[controlState]
}

function hasAutomaticEvents(controlState) {
  return isCompoundState(controlState) || isEventlessState(controlState)
}

function getAutomaticEvent(controlState, eventData) {
  if (isCompoundState(controlState)) {
    return { eventName: INIT_EVENT, eventData }
  }
  else if (isEventlessState(controlState)) {
    return { eventName: _EVENTLESS_, eventData }
  }
  else {
    throw `getAutomaticEvent: should be called only for control state which admit automatic events...!`
  }
}

const eventHandlers = {
  [INIT]: {
    [START]: handleStartInInitState
  },
  [SUSPENSE]: {
    [INIT_EVENT]: handleInitInSuspenseState,
    [SUCCEEDED]: handleSucceededInSuspenseState,
    [FAILED]: handleFailedInSuspenseState
  },
  [PENDING]: {
    [TIMER_EXPIRED]: handleTimerExpiredInPendingState,
  },
  [SPINNING]: {},
  [ERROR]: {},
  [DONE]: {}
};

export function compiledFactory(settings) {
  let controlState = initialControlState;
  let extendedState = initialExtendedState;
  let historyState = null;

  // TODO: haven't dealt with history states yet!! That should be done in the event handler?
  return function suspenseFsm(event) {
    const { eventName, eventData } = destructureEvent(event);
    let currEventHandler;

    // Deal with events on compound states
    if ([PENDING, SPINNING].includes(controlState) && [SUCCEEDED, FAILED].includes(eventName)) {
      currEventHandler = eventHandlers[SUSPENSE][eventName]
    }
    else {
      currEventHandler = eventHandlers[controlState][eventName];
    }

    if (!currEventHandler) { return NO_OUTPUT }
    else {
      let loopCount = 0;
      let shouldProcessAnotherEvent = false;
      let currMachineState = { controlState, extendedState, historyState };
      let currEventData = eventData;
      let currOutputs = [];

      do {
        const { updatedMachineState, outputs } = currEventHandler(currMachineState, currEventData, settings);
        currOutputs = aggregateOutputs(currOutputs, outputs);

        // Update machine state
        controlState = updatedMachineState.updatedControlState;
        extendedState = updatedMachineState.updatedExtendedState;
        historyState = updatedMachineState.updatedHistoryState;

        if (!hasAutomaticEvents(controlState)) {
          shouldProcessAnotherEvent = false;
        }
        else {
          shouldProcessAnotherEvent = true;
          const automaticEvent = getAutomaticEvent(controlState, eventData);
          currEventHandler = eventHandlers[controlState][automaticEvent.eventName];
          currEventData = automaticEvent.eventData;
          currMachineState = { controlState, extendedState, historyState };
        }
      }
      while ( shouldProcessAnotherEvent && ++loopCount < maxLoopCount )

      if (loopCount === maxLoopCount) {
        throw `Stopping a possible infinite loop after ${maxLoopCount} loops! Unless you have a very deeply nested machine(!), there may be a bug in the machine compiler implementation.`
      }

      return currOutputs
    }
  }
}

/**
 * Aggregates two machine outputs into a single array of machine outputs
 * @param {Array} o1
 * @param {Array} o2
 * @returns {Array}
 */
function aggregateOutputs(o1, o2) {
  return o1.concat(o2)
}

function handleStartInInitState(machineState, eventData, settings) {
  const { controlState, extendedState, historyState } = machineState;
  const { updates, outputs } = runOperation(extendedState, eventData, settings);
  // TODO: in the compiler distinguish case when no history state update and when there is
  const updatedHistoryState = historyState;

  const updatedMachineState = {
    updatedControlState: SUSPENSE,
    updatedExtendedState: updateState(extendedState, updates),
    updatedHistoryState
  }

  return {
    updatedMachineState,
    outputs
  }
}

function handleInitInSuspenseState(machineState, eventData, settings) {
  const { controlState, extendedState, historyState } = machineState;
  const { updates, outputs } = startTimer(extendedState, eventData, settings);
  const updatedHistoryState = historyState;

  const updatedMachineState = {
    updatedControlState: PENDING,
    updatedExtendedState: updateState(extendedState, updates),
    updatedHistoryState
  }

  return {
    updatedMachineState,
    outputs
  }
}

function handleTimerExpiredInPendingState(machineState, eventData, settings) {
  const { controlState, extendedState, historyState } = machineState;
  const { updates, outputs } = renderFallback(extendedState, eventData, settings);
  const updatedHistoryState = historyState;

  const updatedMachineState = {
    updatedControlState: SPINNING,
    updatedExtendedState: updateState(extendedState, updates),
    updatedHistoryState
  }

  return {
    updatedMachineState,
    outputs
  }
}

function handleSucceededInSuspenseState(machineState, eventData, settings) {
  const { controlState, extendedState, historyState } = machineState;
  const { updates, outputs } = renderSucceeded(extendedState, eventData, settings);
  // TODO : I should update the history state her but won't cause no history states defined for this compound state!
  const updatedHistoryState = historyState;

  const updatedMachineState = {
    updatedControlState: DONE,
    updatedExtendedState: updateState(extendedState, updates),
    updatedHistoryState
  }

  return {
    updatedMachineState,
    outputs
  }
}

function handleFailedInSuspenseState(machineState, eventData, settings) {
  const { controlState, extendedState, historyState } = machineState;
  const { updates, outputs } = renderError(extendedState, eventData, settings);
  // TODO : I should update the history state her but won't cause no history states defined for this compound state!
  const updatedHistoryState = historyState;

  const updatedMachineState = {
    updatedControlState: ERROR,
    updatedExtendedState: updateState(extendedState, updates),
    updatedHistoryState
  }

  return {
    updatedMachineState,
    outputs
  }
}

// const transitions = [
//   { from: INIT, event: START, to: SUSPENSE, action: runOperation },
//   { from: SUSPENSE, event: INIT_EVENT, to: PENDING, action: startTimer },
//   { from: PENDING, event: TIMER_EXPIRED, to: SPINNING, action: renderFallback },
//   { from: SUSPENSE, event: SUCCEEDED, to: DONE, action: renderSucceeded },
//   { from: SUSPENSE, event: FAILED, to: ERROR, action: renderError },
// ];

// const states = {
//   [INIT]: "",
//   [SUSPENSE]: {
//     [PENDING]: "",
//     [SPINNING]: "",
//   },
//   [ERROR]: "",
//   [DONE]: "",
// };
