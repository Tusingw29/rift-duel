import {parentPort,workerData} from 'node:worker_threads';import {runMatch} from './run.mjs';parentPort.postMessage(workerData.jobs.map(runMatch));
