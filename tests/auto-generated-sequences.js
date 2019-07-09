// TODO : on hold, some issues with regenerator runtime when using graph-adt...
// do I use generators ? reverse to older version
import {generateTestSequences} from "state-transducer-testing"
import { fsmDef} from "../src"
import { EV_START, EV_TIMER_EXPIRED, EV_ERROR, EV_SUCCEEDED } from "./properties"
import { ALL_n_TRANSITIONS, ALL_TRANSITIONS } from "../src/graph-adt"
import { formatResult } from "./helpers"
import { stateMonikers } from "../src/properties"

const [INIT, SUSPENSE, PENDING, SPINNING, ERROR, DONE] = stateMonikers;

// const fsmDef = {
//   transitions: [
//     { from: INIT, event: START, to: SUSPENSE, action: runOperation },
//     { from: SUSPENSE, event: INIT_EVENT, to: PENDING, action: startTimer },
//     { from: PENDING, event: TIMER_EXPIRED, to: SPINNING, action: renderFallback },
//     { from: SUSPENSE, event: SUCCEEDED, to: DONE, action: renderSucceeded },
//     { from: SUSPENSE, event: FAILED, to: ERROR, action: renderError },
//   ]
// }
function genInit(extS){
  return { input: null, hasGeneratedInput: true }
}

function genStart(extS){
  return { input: EV_START, hasGeneratedInput: true }
}

function genTimerExpired(extS){
  return { input: EV_TIMER_EXPIRED, hasGeneratedInput: true }
}

function genSucceeded(data){
  return function genSucceeded(extS){
    return { input: EV_SUCCEEDED(data), hasGeneratedInput: true }
  }
}

function genError(err){
  return function genSucceeded(extS){
    return { input: EV_SUCCEEDED(err), hasGeneratedInput: true }
  }
}

const generators = ({data, err}) => ([
  // NOTE: This should always be the first line and point towards the init control state when configured
    { from: "INIT_STATE", event: "INIT_EVENT", to: "INIT", gen: genInit},
    { from: "INIT", event: "START", to: "SUSPENSE", gen: genStart },
    // No need for input generators on automatic events (except at machine start time)
    { from: "SUSPENSE", event: "INIT_EVENT", to: "PENDING", gen: void 0 },
    { from: "PENDING", event: "TIMER_EXPIRED", to: "SPINNING", gen: genTimerExpired },
    { from: "SUSPENSE", event: "SUCCEEDED", to: "DONE", gen: genSucceeded(data) },
    { from: "SUSPENSE", event: "FAILED", to: "ERROR", gen: genError(err) },
  ]);

// TODO: targetVertex DONE and ERROR
const strategy = ALL_TRANSITIONS({ targetVertex: DONE });
// TODO: put the setting timeout and task
const settings = merge({}, { strategy });
// TODO : parameterize data and err for the input generation
const results = generateTestSequences(fsmDef, generators({data: void 0, err: void 0}), settings);
const formattedResults = formatResult(results);
assert.deepEqual(formattedResults.map(x => x.controlStateSequence), [
  ["nok", "B", "C", "INNER_GROUP_D", "D", "A", "OUTER_GROUP_D", "INNER_GROUP_D", "D", "E"],
], `...`);
assert.deepEqual(formattedResults.map(x => x.inputSequence), [
  [
    { "click": { "keyB": "valueB" } },
    { "click": { "data": "valueC", "valid": true } },
    { "reviewA": null },
    { "click": null },
    { "save": null }
  ],
], `...`);
assert.deepEqual(formattedResults.map(x => x.outputSequence), [
  [
    NO_OUTPUT, NO_OUTPUT, NO_OUTPUT, NO_OUTPUT, {
    "b": { "keyB": "valueB" },
    "c": { "data": "valueC", "error": null },
    "reviewed": true,
    "switch": true
  }
  ],
], `...`);
