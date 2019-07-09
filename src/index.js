import { createStateMachine, INIT_EVENT, destructureEvent, NO_OUTPUT } from "kingly"
import { commandMonikers, defaultTimeout, eventMonikers, properties, stateMonikers } from "../src/properties"

const [FALLBACK, MAIN, ERR] = properties;
const [INIT, SUSPENSE, PENDING, SPINNING, ERROR, DONE] = stateMonikers;
const [START, TIMER_EXPIRED, SUCCEEDED, FAILED] = eventMonikers;
const [COMMAND_RENDER, RUN, START_TIMER] = commandMonikers;

// State update
// Basically {a, b: {c, d}}, [{b:{e}]} -> {a, b:{e}}
// All Object.assign caveats apply
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
function updateState(extendedState, extendedStateUpdates) {
  const extendedStateCopy = Object.assign({}, extendedState);
  return extendedStateUpdates.reduce((acc, x) => Object.assign(acc, x), extendedStateCopy);
}

export const events = [TIMER_EXPIRED, SUCCEEDED, FAILED, START];
const states = {
  [INIT]: "",
  [SUSPENSE]: {
    [PENDING]: "",
    [SPINNING]: "",
  },
  [ERROR]: "",
  [DONE]: "",
};
const initialControlState = INIT;
const initialExtendedState = {};
const transitions = [
  { from: INIT, event: START, to: SUSPENSE, action: runOperation },
  { from: SUSPENSE, event: INIT_EVENT, to: PENDING, action: startTimer },
  { from: PENDING, event: TIMER_EXPIRED, to: SPINNING, action: renderFallback },
  { from: SUSPENSE, event: SUCCEEDED, to: DONE, action: renderSucceeded },
  { from: SUSPENSE, event: FAILED, to: ERROR, action: renderError },
];

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
      params: timeout || defaultTimeout
    }],
  }
}

function renderFallback(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [{
      command: COMMAND_RENDER,
      params: { display: FALLBACK }
    }],
  }
}

function renderSucceeded(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [{
      command: COMMAND_RENDER,
      params: { display: MAIN, data: eventData }
    }],
  }
}

function renderError(extendedState, eventData, settings) {
  return {
    updates: [],
    outputs: [{
      command: COMMAND_RENDER,
      params: { display: ERR, data: eventData }
    }],
  }
}

export const fsmDef = {
  initialControlState,
  initialExtendedState,
  states,
  events,
  transitions,
  updateState
};

export function factory(settings) {
  return createStateMachine(fsmDef, settings)
}

