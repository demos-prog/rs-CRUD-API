import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import process from 'node:process';
import server from './worker';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log("CPUs: " + numCPUs);

  for (let i = 0; i < numCPUs - 1; i++) {
    const worker = cluster.fork();
    console.log(`Worker ${worker.process.pid} started`);
    worker.on('exit', () => {
      console.log(`Worker ${worker.process.pid} has died`);
      const newWorker = cluster.fork();
      console.log(`Worker ${newWorker.process.pid} started`);
    });
  }

  server.listen(process.env.PORT || 5000, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
  });

} else {
  server;
}