import fc from 'fast-check'
fc.configureGlobal({ numRuns: process.env.FC_NUM_RUNS || 100, verbose: 1 })
