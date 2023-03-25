const { TaskQueueManager } = require("../TaskQueueManager");
const { imagine } = require("../requests/requests.js");

const taskManager = new TaskQueueManager(2, 4000);

const prompts = ["Johnny Depp as Jack Sparrow riding a Bike", "Ryan Gosling in a suite balloting for president", "Keanu Reeves finally happy"];

Promise.all(prompts.map((prompt) => taskManager.enqueue(() => imagine(`Vivid and detailed shot of ${prompt}:: shot on high-speed 35mm lens, sharp focus, low dof, colorful, realistic, accent lighting --ar 7:4 --no text`))))
  .then((responses) => console.log(responses))
  .catch((error) => console.error(error));
