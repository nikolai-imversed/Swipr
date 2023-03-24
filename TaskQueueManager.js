const { Queue } = require("async-await-queue");

class TaskQueueManager {
  constructor(maxConcurrent, minCycle) {
    this.maxConcurrent = maxConcurrent;
    this.minCycle = minCycle;
    this.myQueue = new Queue(maxConcurrent, minCycle);
  }

  async enqueue(task) {
    return await this.myQueue.run(task);
  }
}

module.exports = { TaskQueueManager };
