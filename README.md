# Testing

## Main paths
### Control Flow
1. Start -> Spinning -> Ready
2. Start -> Spinning -> Error
3. Start -> Error
4. Start -> Ready

### Data Flow
- run operation (none | some) x timeout (any | default)
- ready (no data | data)
- error (no data | data)

### Strategy
We will mix control and data flow in our test sequences.

### Oracle
1. Start -> Spinning -> Ready
   - No run:
     - emit timer | render fallback | render main
   - run:
     - run task | emit timer | render fallback | render main
2. Start -> Spinning -> Error
   - No run:
     - emit timer | render fallback | render error
   - run:
     - run task | emit timer | render fallback | render error
3. Start -> Ready
   - No run:
     - emit timer | render main
   - run:
     - run task | emit timer | render main
4. Start -> Error
   - No run:
     - emit timer | render main
   - run:
     - run task | emit timer | render main

### Properties
Abstracting null commands:
- emit timer is always there
- run task command is always before emit timer when present
- render main is last when present
- render error is last when present 
- the render fallback command when present is always immediately after emit timer 

## Edge cases
Basically not starting with start, receiving unexpected events etc.
- make some myself: take the oracle and intersperse event there, I know where the null will be from the oracle
- make some random one
