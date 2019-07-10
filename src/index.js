import { createStateMachine, destructureEvent, INIT_EVENT, NO_OUTPUT } from "kingly"
import {
  eventMonikers, renderError, renderFallback, renderSucceeded, runOperation, startTimer, stateMonikers
} from "../src/properties"

export { compiledFactory } from "./compiled-fsm"
export { commandMonikers, eventMonikers, properties } from "./properties"

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

export const fsmDef = {
  initialControlState,
  initialExtendedState,
  states,
  events: eventMonikers,
  transitions,
  updateState
};

export function factory(settings) {
  return createStateMachine(fsmDef, settings)
}

