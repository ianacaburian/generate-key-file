import fc from 'fast-check'

fc.configureGlobal({
    verbose: 1,
    numRuns: process.env.FC_NUM_RUNS || 1,
    seed: process.env.FC_SEED || 1
})
