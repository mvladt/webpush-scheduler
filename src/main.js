import express from "express";

import router from "./router.js";
import scheduler from "./scheduler.js";

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Express server listening on port ${port}.`);
  scheduler.run();
});
