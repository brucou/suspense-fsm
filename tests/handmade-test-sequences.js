import { FAILED, START, SUCCEEDED, TIMER_EXPIRED } from "../src"
import {  multiplySequences } from "./helpers"
import { EV_START, EV_TIMER_EXPIRED, EV_ERROR, EV_SUCCEEDED } from "./properties"

const arbitraryData = {key: 'value'};
const arbitraryError = new Error('an error occurred!');

const EV_START_INPUTS = [EV_START];
const EV_TIMER_EXPIRED_INPUTS = [EV_TIMER_EXPIRED];
const EV_SUCCEEDED_INPUTS = [EV_SUCCEEDED(), EV_SUCCEEDED(arbitraryData)];
const EV_ERROR_INPUTS = [EV_ERROR(), EV_ERROR(arbitraryError)];

export const START_SPINNING_READY_SCENARIOS = multiplySequences([EV_START_INPUTS, EV_TIMER_EXPIRED_INPUTS, EV_SUCCEEDED_INPUTS]);
export const START_SPINNING_ERROR_SCENARIOS = multiplySequences([EV_START_INPUTS, EV_TIMER_EXPIRED_INPUTS, EV_ERROR_INPUTS]);
export const START_READY_SCENARIOS = multiplySequences([EV_START_INPUTS, EV_SUCCEEDED_INPUTS]);
export const START_ERROR_SCENARIOS = multiplySequences([EV_START_INPUTS, EV_ERROR_INPUTS]);
