const { TaskQueueManager } = require("./TaskQueueManager");
const { imagine } = require("./requests/requests.js");

const taskManager = new TaskQueueManager(2, 4000);

const prompts = ["Donald Trump dancing gangnam style", "Joe Biden making tiktoks", "George Bush telling a joke at stand-up show"];

Promise.all(prompts.map((prompt) => taskManager.enqueue(() => imagine(`Vivid and detailed shot of ${prompt} high-speed 35mm lens, sharp focus, low dof:: colorful, realistic, accent lighting --ar 7:4 --no text`))))
  .then((responses) => console.log(responses))
  .catch((error) => console.error(error));
