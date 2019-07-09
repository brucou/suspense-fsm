import { FAILED, START, SUCCEEDED, TIMER_EXPIRED } from "../src"

export const EV_START = {[START]: void 0};

export const EV_TIMER_EXPIRED = {[TIMER_EXPIRED]: void 0};
export const EV_SUCCEEDED = data => ({[SUCCEEDED]: data})
export const EV_ERROR = error => ({[FAILED]: error})
