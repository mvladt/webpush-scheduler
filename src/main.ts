import express from "express";
import cors from "cors";

import router from "./router.ts";
import scheduler from "./scheduler.ts";

const app = express();
app.use(cors());

const port = process.env.PORT;

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Express server listening on port ${port}.`);
  scheduler.run();
});
