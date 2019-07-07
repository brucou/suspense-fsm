import { COMMAND_RENDER, destructureEvent, INIT_EVENT, NO_OUTPUT } from "kingly"

// Define properties
const FALLBACK = "FALLBACK";
const MAIN = "MAIN";
const ERR = "ERR";
export const properties = [FALLBACK, MAIN, ERR];

// Define the state machine
// State monikers
const INIT = "OFF";
const SUSPENSE = "SUSPENSE";
const PENDING = "PENDING";
const SPINNING = "SPINNING";
const ERROR = "ERROR";
const DONE = "DONE";

// Event monikers
export const START = "START";
export const TIMER_EXPIRED = "TIMER_EXPIRED";
export const SUCCEEDED = "SUCCEEDED";
export const FAILED = "FAILED";

// Commands
const RUN = "RUN";
const START_TIMER = "START_TIMER";
export const commands = [COMMAND_RENDER, RUN, START_TIMER];

// Actions
function runOperation(extendedState, eventData, settings) {
  const { task } = settings;

  return task
    ? {
      updates: [],
      outputs: [{
        command: RUN,
        params: task
      }],
    }
    : { updates: [], outputs: [] }
}

function startTimer(extendedState, eventData, settings) {
  const { timeout } = settings;

  return {
    updates: [],
    outputs: [{
      command: START_TIMER,
      params: timeout || 200
    }],
  }
}

// State update
// Basically {a, b: {c, d}}, [{b:{e}]} -> {a, b:{e}}
// All Object.assign caveats apply
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
function updateState(extendedState, extendedStateUpdates) {
  const extendedStateCopy = Object.assign({}, extendedState);
  return extendedStateUpdates.reduce((acc, x) => Object.assign(acc, x), extendedStateCopy);
}
const initialControlState = INIT;
const initialExtendedState = {};

export function compiledFactory(settings) {
  let controlState = initialControlState;
  let extendedState = initialExtendedState;
  let historyState = null;

  const eventHandlers= {
    [INIT]: {
      [START]: handleStartInInitState
    },
    [SUSPENSE]: {
      [INIT_EVENT]: handleInitInSuspenseState,
    },
    [PENDING]: {
      [TIMER_EXPIRED]: handleTimerExpiredInPendingState,
      [SUCCEEDED]: handleSucceededInSuspensePendingState,
      [FAILED]: handleFailedInSuspensePendingState
    },
    [SPINNING]: {
      [SUCCEEDED]: handleSucceededInSuspenseSpinningState,
      [FAILED]: handleFailedInSuspenseSpinningState
    },
    [ERROR]: {    },
    [DONE]: {}
  };

  return function suspenseFsm(event) {
    const {eventName, eventData} = destructureEvent(event);
    let outputs = NO_OUTPUT;

    const eventHandler = eventHandlers[controlState][eventName];
    if (!eventHandler){
      return NO_OUTPUT
    }
    else {
      let {updatedMachineState, outputs} = eventHandler({controlState, extendedState, historyState}, eventData, settings);
      controlState = updatedMachineState.controlState;
      extendedState = updatedMachineState.extendedState;
      historyState = updatedMachineState.historyState;

      return outputs
    }
  }
}

/**
 * Aggregates two machine outputs into a single array of machine outputs
 * @param {Array} o1
 * @param {Array} o2
 * @returns {Array}
 */
function aggregateOutputs(o1, o2){
  return o1.concat(o2)
}

function handleStartInInitState(machineState, eventData, settings){
  let temp;
  let updates;
  let outputs;

  let {controlState, extendedState, historyState} = machineState;
  let updatedControlState = controlState;
  const updatedExtendedState0 = extendedState;
  const updatedHistoryState0 = historyState;
  const aggregatedOutputs0 = [];

  // NOTE: this could be written with less code with a reduce over
  // [[runOperation], [startTimer]
  // but better inlining it for now. This would only work when no guards I guess
  const temp1 = runOperation(updatedExtendedState0, eventData, settings);
  updates = temp1.updates;
  outputs = temp1.outputs;
  updatedControlState = SUSPENSE;
  const updatedExtendedState1 = updateState(updatedExtendedState0, updates);
  const updatedHistoryState1 = updatedHistoryState0;
  const aggregatedOutputs1 = aggregateOutputs(aggregatedOutputs0, outputs);

  // Kingly semantics: INIT_EVENT passes on previous event data
  temp = startTimer(updatedExtendedState1, eventData, settings);
  updates = temp.updates;
  outputs = temp.outputs;
  updatedControlState = PENDING;
  const updatedExtendedState2 = updateState(updatedExtendedState1, updates);
  const updatedHistoryState2 = updatedHistoryState1;
  const aggregatedOutputs2 = aggregateOutputs(aggregatedOutputs1, outputs);

  const updatedMachineState= {
    controlState: updatedControlState,
    extendedState: updatedExtendedState2,
    historyState: updatedHistoryState2
  }

  return {
    updatedMachineState,
    outputs: aggregatedOutputs2
  }
}

function handleInitInSuspenseState(machineState, eventData, settings){}
function handleTimerExpiredInPendingState(machineState, eventData, settings){}
function handleSucceededInSuspensePendingState(machineState, eventData, settings){}
function handleFailedInSuspensePendingState(machineState, eventData, settings){}
function handleSucceededInSuspenseSpinningState(machineState, eventData, settings){}
function handleFailedInSuspenseSpinningState(machineState, eventData, settings){}

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
