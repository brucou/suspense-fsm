import * as QUnit from "qunitjs"
import { compiledFactory } from "../src/compiled-fsm"
import { formatResult } from "./helpers"
import { defaultTimeout, eventMonikers, stateMonikers } from "../src/properties"

const [START, TIMER_EXPIRED, SUCCEEDED, FAILED] = eventMonikers;

const dummyTask = function dummyTask (){}

const noSettings = {};
const durationSettings = {timeout: 100};
const taskSettings = {task: dummyTask };

QUnit.module("Testing compiled fsm", {});

QUnit.test("no settings: START", function exec_test(assert) {
  const fsm = compiledFactory(noSettings);

  const actual = fsm({[START]: void 0});
  const expected = [
    {
      "command": "START_TIMER",
      "params": defaultTimeout
    }
  ];

  assert.deepEqual(actual, expected, `OK!`);
});

QUnit.test("timeout settings: START", function exec_test(assert) {
  const fsm = compiledFactory(durationSettings);

  const actual = fsm({[START]: void 0});
  const expected = [
    {
      "command": "START_TIMER",
      "params": durationSettings.timeout
    }
  ];

  assert.deepEqual(actual, expected, `OK!`);
});

QUnit.test("task settings: START", function exec_test(assert) {
  const fsm = compiledFactory(taskSettings);

  const actual = fsm({[START]: void 0});
  const expected = [
    {
      "command": "RUN",
      "params": "dummyTask"
    },
    {
      "command": "START_TIMER",
      "params": 200
    }
  ];

  assert.deepEqual(actual.map(formatResult), expected, `OK!`);
});

