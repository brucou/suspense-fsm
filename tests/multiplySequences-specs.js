import * as QUnit from "qunitjs"
import { multiplySequences } from "./helpers"

QUnit.module("Testing multiplySequences", {});

QUnit.test("", function exec_test(assert) {
  const actual = multiplySequences([]);

  const expected = [];

  assert.deepEqual(actual, expected, `empty array: OK!`);
});

QUnit.test("[]", function exec_test(assert) {
  const actual = multiplySequences([[]]);

  const expected = [];

  assert.deepEqual(actual, expected, `empty array: OK!`);
});

QUnit.test("[0,1]", function exec_test(assert) {
  const actual = multiplySequences([[0, 1]]);

  const expected = [
    [0],
    [1]
  ];

  assert.deepEqual(actual, expected, `OK!`);
});

QUnit.test(`[0,1] x ["a", "b"]`, function exec_test(assert) {
  const actual = multiplySequences([[0, 1], ["a", "b"]]);

  const expected = [
    [
      0,
      "a"
    ],
    [
      0,
      "b"
    ],
    [
      1,
      "a"
    ],
    [
      1,
      "b"
    ]
  ]

  assert.deepEqual(actual, expected, `OK!`);
});

QUnit.test(`[0,1] x ["a", "b"] x ["z"]`, function exec_test(assert) {
  const actual = multiplySequences([[0, 1], ["a", "b"], ["z"]]);

  const expected = [
    [0, "a", "z"],
    [0, "b", "z"],
    [1, "a", "z"],
    [1, "b", "z"]
  ]

  assert.deepEqual(actual, expected, `OK!`);
});

QUnit.test(`[0,1] x ["a", "b"] x ["z"] x ["aa","bb", "cc"]`, function exec_test(assert) {
  const actual = multiplySequences([[0, 1], ["a", "b"], ["z"], ["aa", "bb", "cc"]]);

  const expected = [
    [0, "a", "z", "aa"],
    [0, "a", "z", "bb"],
    [0, "a", "z", "cc"],
    [0, "b", "z", "aa"],
    [0, "b", "z", "bb"],
    [0, "b", "z", "cc"],
    [1, "a", "z", "aa"],
    [1, "a", "z", "bb"],
    [1, "a", "z", "cc"],
    [1, "b", "z", "aa"],
    [1, "b", "z", "bb"],
    [1, "b", "z", "cc"]
  ]

  assert.deepEqual(actual, expected, `OK!`);
});
