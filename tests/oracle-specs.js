import * as QUnit from "qunitjs"
import { defaultTimeout, factory } from "../src/"
import {
  START_ERROR_SCENARIOS, START_READY_SCENARIOS, START_SPINNING_ERROR_SCENARIOS, START_SPINNING_READY_SCENARIOS
} from "./handmade-test-sequences"
import { formatInputSeq, formatResult, getRandomArbitrary } from "./helpers"

QUnit.module("Testing fsm with oracle - START_SPINNING_READY scenarios", {});

const dummyTask = function dummyTask() {}
const timeout = Math.floor(getRandomArbitrary(0, 500));

START_SPINNING_READY_SCENARIOS.forEach(inputSeq => {
  QUnit.test(`With task and timeout: ${formatInputSeq(inputSeq)}`, function exec_test(assert) {
    const fsm = factory({ task: dummyTask, timeout });
    const data = Object.values(inputSeq[2])[0];

    const outputSeq = inputSeq.map(fsm);

    const actual = formatResult(outputSeq);
    const expected = [
      [
        { "command": "RUN", "params": "dummyTask" },
        { "command": "START_TIMER", "params": timeout }
      ],
      [
        { "command": "render", "params": { "display": "FALLBACK" } }
      ],
      [
        { "command": "render", "params": { "data": data, "display": "MAIN" } }
      ]
    ];

    assert.deepEqual(actual, expected, `OK!`);
  });
})

START_SPINNING_READY_SCENARIOS.forEach(inputSeq => {
  QUnit.test(`With task and no timeout: ${formatInputSeq(inputSeq)}`, function exec_test(assert) {
    const fsm = factory({ task: dummyTask });
    const data = Object.values(inputSeq[2])[0];

    const outputSeq = inputSeq.map(fsm);

    const actual = formatResult(outputSeq);
    const expected = [
      [
        { "command": "RUN", "params": "dummyTask" },
        { "command": "START_TIMER", "params": defaultTimeout }
      ],
      [
        { "command": "render", "params": { "display": "FALLBACK" } }
      ],
      [
        { "command": "render", "params": { "data": data, "display": "MAIN" } }
      ]
    ];

    assert.deepEqual(actual, expected, `OK!`);
  });
})

START_SPINNING_READY_SCENARIOS.forEach(inputSeq => {
  QUnit.test(`With no task and timeout: ${formatInputSeq(inputSeq)}`, function exec_test(assert) {
    const fsm = factory({ task: void 0, timeout });
    const data = Object.values(inputSeq[2])[0];

    const outputSeq = inputSeq.map(fsm);

    const actual = formatResult(outputSeq);
    const expected = [
      [
        { "command": "START_TIMER", "params": timeout }
      ],
      [
        { "command": "render", "params": { "display": "FALLBACK" } }
      ],
      [
        { "command": "render", "params": { "data": data, "display": "MAIN" } }
      ]
    ];

    assert.deepEqual(actual, expected, `OK!`);
  });
})

START_SPINNING_READY_SCENARIOS.forEach(inputSeq => {
  QUnit.test(`With no task and no timeout: ${formatInputSeq(inputSeq)}`, function exec_test(assert) {
    const fsm = factory({});
    const data = Object.values(inputSeq[2])[0];

    const outputSeq = inputSeq.map(fsm);

    const actual = formatResult(outputSeq);
    const expected = [
      [
        { "command": "START_TIMER", "params": defaultTimeout }
      ],
      [
        { "command": "render", "params": { "display": "FALLBACK" } }
      ],
      [
        { "command": "render", "params": { "data": data, "display": "MAIN" } }
      ]
    ];

    assert.deepEqual(actual, expected, `OK!`);
  });
})

QUnit.module("Testing fsm with oracle - START_SPINNING_ERROR scenarios", {});

START_SPINNING_ERROR_SCENARIOS.forEach(inputSeq => {
  QUnit.test(`With task and timeout: ${formatInputSeq(inputSeq)}`, function exec_test(assert) {
    const fsm = factory({ task: dummyTask, timeout });
    const err = Object.values(inputSeq[2])[0];

    const outputSeq = inputSeq.map(fsm);

    const actual = formatResult(outputSeq);
    const expected = [
      [
        { "command": "RUN", "params": "dummyTask" },
        { "command": "START_TIMER", "params": timeout }
      ],
      [
        { "command": "render", "params": { "display": "FALLBACK" } }
      ],
      [
        { "command": "render", "params": { "data": err, "display": "ERR" } }
      ]
    ];

    assert.deepEqual(actual, expected, `OK!`);
  });
})

START_SPINNING_ERROR_SCENARIOS.forEach(inputSeq => {
  QUnit.test(`With task and no timeout: ${formatInputSeq(inputSeq)}`, function exec_test(assert) {
    const fsm = factory({ task: dummyTask });
    const err = Object.values(inputSeq[2])[0];

    const outputSeq = inputSeq.map(fsm);

    const actual = formatResult(outputSeq);
    const expected = [
      [
        { "command": "RUN", "params": "dummyTask" },
        { "command": "START_TIMER", "params": defaultTimeout }
      ],
      [
        { "command": "render", "params": { "display": "FALLBACK" } }
      ],
      [
        { "command": "render", "params": { "data": err, "display": "ERR" } }
      ]
    ];

    assert.deepEqual(actual, expected, `OK!`);
  });
})

START_SPINNING_ERROR_SCENARIOS.forEach(inputSeq => {
  QUnit.test(`With no task and timeout: ${formatInputSeq(inputSeq)}`, function exec_test(assert) {
    const fsm = factory({ task: void 0, timeout });
    const err = Object.values(inputSeq[2])[0];

    const outputSeq = inputSeq.map(fsm);

    const actual = formatResult(outputSeq);
    const expected = [
      [
        { "command": "START_TIMER", "params": timeout }
      ],
      [
        { "command": "render", "params": { "display": "FALLBACK" } }
      ],
      [
        { "command": "render", "params": { "data": err, "display": "ERR" } }
      ]
    ];

    assert.deepEqual(actual, expected, `OK!`);
  });
})

START_SPINNING_ERROR_SCENARIOS.forEach(inputSeq => {
  QUnit.test(`With no task and no timeout: ${formatInputSeq(inputSeq)}`, function exec_test(assert) {
    const fsm = factory({});
    const err = Object.values(inputSeq[2])[0];

    const outputSeq = inputSeq.map(fsm);

    const actual = formatResult(outputSeq);
    const expected = [
      [
        { "command": "START_TIMER", "params": defaultTimeout }
      ],
      [
        { "command": "render", "params": { "display": "FALLBACK" } }
      ],
      [
        { "command": "render", "params": { "data": err, "display": "ERR" } }
      ]
    ];

    assert.deepEqual(actual, expected, `OK!`);
  });
})

QUnit.module("Testing fsm with oracle - START_READY scenarios", {});

START_READY_SCENARIOS.forEach(inputSeq => {
  QUnit.test(`With task and timeout: ${formatInputSeq(inputSeq)}`, function exec_test(assert) {
    const fsm = factory({ task: dummyTask, timeout });
    const data = Object.values(inputSeq[1])[0];

    const outputSeq = inputSeq.map(fsm);

    const actual = formatResult(outputSeq);
    const expected = [
      [
        { "command": "RUN", "params": "dummyTask" },
        { "command": "START_TIMER", "params": timeout }
      ],
      [
        { "command": "render", "params": { "data": data, "display": "MAIN" } }
      ]
    ];

    assert.deepEqual(actual, expected, `OK!`);
  });
})

START_READY_SCENARIOS.forEach(inputSeq => {
  QUnit.test(`With task and no timeout: ${formatInputSeq(inputSeq)}`, function exec_test(assert) {
    const fsm = factory({ task: dummyTask });
    const data = Object.values(inputSeq[1])[0];

    const outputSeq = inputSeq.map(fsm);

    const actual = formatResult(outputSeq);
    const expected = [
      [
        { "command": "RUN", "params": "dummyTask" },
        { "command": "START_TIMER", "params": defaultTimeout }
      ],
      [
        { "command": "render", "params": { "data": data, "display": "MAIN" } }
      ]
    ];

    assert.deepEqual(actual, expected, `OK!`);
  });
})

START_READY_SCENARIOS.forEach(inputSeq => {
  QUnit.test(`With no task and timeout: ${formatInputSeq(inputSeq)}`, function exec_test(assert) {
    const fsm = factory({ task: void 0, timeout });
    const data = Object.values(inputSeq[1])[0];

    const outputSeq = inputSeq.map(fsm);

    const actual = formatResult(outputSeq);
    const expected = [
      [
        { "command": "START_TIMER", "params": timeout }
      ],
      [
        { "command": "render", "params": { "data": data, "display": "MAIN" } }
      ]
    ];

    assert.deepEqual(actual, expected, `OK!`);
  });
})

START_READY_SCENARIOS.forEach(inputSeq => {
  QUnit.test(`With no task and no timeout: ${formatInputSeq(inputSeq)}`, function exec_test(assert) {
    const fsm = factory({});
    const data = Object.values(inputSeq[1])[0];

    const outputSeq = inputSeq.map(fsm);

    const actual = formatResult(outputSeq);
    const expected = [
      [
        { "command": "START_TIMER", "params": defaultTimeout }
      ],
      [
        { "command": "render", "params": { "data": data, "display": "MAIN" } }
      ]
    ];

    assert.deepEqual(actual, expected, `OK!`);
  });
})

QUnit.module("Testing fsm with oracle - START_ERROR scenarios", {});

START_ERROR_SCENARIOS.forEach(inputSeq => {
  QUnit.test(`With task and timeout: ${formatInputSeq(inputSeq)}`, function exec_test(assert) {
    const fsm = factory({ task: dummyTask, timeout });
    const err = Object.values(inputSeq[1])[0];

    const outputSeq = inputSeq.map(fsm);

    const actual = formatResult(outputSeq);
    const expected = [
      [
        { "command": "RUN", "params": "dummyTask" },
        { "command": "START_TIMER", "params": timeout }
      ],
      [
        { "command": "render", "params": { "data": err, "display": "ERR" } }
      ]
    ];

    assert.deepEqual(actual, expected, `OK!`);
  });
})

START_ERROR_SCENARIOS.forEach(inputSeq => {
  QUnit.test(`With task and no timeout: ${formatInputSeq(inputSeq)}`, function exec_test(assert) {
    const fsm = factory({ task: dummyTask });
    const err = Object.values(inputSeq[1])[0];

    const outputSeq = inputSeq.map(fsm);

    const actual = formatResult(outputSeq);
    const expected = [
      [
        { "command": "RUN", "params": "dummyTask" },
        { "command": "START_TIMER", "params": defaultTimeout }
      ],
      [
        { "command": "render", "params": { "data": err, "display": "ERR" } }
      ]
    ];

    assert.deepEqual(actual, expected, `OK!`);
  });
})

START_ERROR_SCENARIOS.forEach(inputSeq => {
  QUnit.test(`With no task and timeout: ${formatInputSeq(inputSeq)}`, function exec_test(assert) {
    const fsm = factory({ task: void 0, timeout });
    const err = Object.values(inputSeq[1])[0];

    const outputSeq = inputSeq.map(fsm);

    const actual = formatResult(outputSeq);
    const expected = [
      [
        { "command": "START_TIMER", "params": timeout }
      ],
      [
        { "command": "render", "params": { "data": err, "display": "ERR" } }
      ]
    ];

    assert.deepEqual(actual, expected, `OK!`);
  });
})

START_ERROR_SCENARIOS.forEach(inputSeq => {
  QUnit.test(`With no task and no timeout: ${formatInputSeq(inputSeq)}`, function exec_test(assert) {
    const fsm = factory({});
    const err = Object.values(inputSeq[1])[0];

    const outputSeq = inputSeq.map(fsm);

    const actual = formatResult(outputSeq);
    const expected = [
      [
        { "command": "START_TIMER", "params": defaultTimeout }
      ],
      [
        { "command": "render", "params": { "data": err, "display": "ERR" } }
      ]
    ];

    assert.deepEqual(actual, expected, `OK!`);
  });
})
