import { eventMonikers } from "../src/properties"

const [START, TIMER_EXPIRED, SUCCEEDED, FAILED] = eventMonikers;

export const EV_START = {[START]: void 0};

export const EV_TIMER_EXPIRED = {[TIMER_EXPIRED]: void 0};
export const EV_SUCCEEDED = data => ({[SUCCEEDED]: data})
export const EV_ERROR = error => ({[FAILED]: error})
