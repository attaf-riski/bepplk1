import express, { Request, Response, Router } from "express";

import dotenv from "dotenv";
import router from "./Routes/Routes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get("/", (req: Request, res: Response) => {
  return res.send({ response: "Hello World - Typescript" });
});

app.use(router);

app.listen(process.env.APP_PORT, () => {
  console.log(
    process.env.APP_NAME + " running on port " + process.env.APP_PORT
  );
});
