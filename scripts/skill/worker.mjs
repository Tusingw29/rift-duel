import {parentPort,workerData} from 'node:worker_threads';import {runMatch} from './run.mjs';
parentPort.postMessage(workerData.jobs.map(j=>runMatch({...j,balance:workerData.balances[j.mode]})));
