import { COMMAND_RENDER, INIT_EVENT, NO_OUTPUT } from "kingly"

export const defaultTimeout = 200;

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
export const stateMonikers = [INIT, SUSPENSE, PENDING, SPINNING, ERROR, DONE];

// Event monikers
export const START = "START";
export const TIMER_EXPIRED = "TIMER_EXPIRED";
export const SUCCEEDED = "SUCCEEDED";
export const FAILED = "FAILED";
export const eventMonikers = [START, TIMER_EXPIRED, SUCCEEDED, FAILED];

// Commands
const RUN = "RUN";
const START_TIMER = "START_TIMER";
export const commandMonikers = [COMMAND_RENDER, RUN, START_TIMER];
