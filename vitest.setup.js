import fc from 'fast-check'

fc.configureGlobal({ numRuns: process.env.FC_NUM_RUNS || 1, verbose: 1 })
