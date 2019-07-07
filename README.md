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
- we know in advance what 

### Properties
- Any sequence of commands starting with Start is non-empty and has a START_TIMER command in the outputs
- Any sequence of commands with a run operation has outputs starting with the run command 
1. Commands: []
