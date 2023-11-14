import express, { Request, Response, Router } from "express";

import dotenv from "dotenv";
import router from "./Routes/Routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import Authorization from "./middleware/Authorization";
import cors from "cors";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json()); //json
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false })); // x-www-form-urlencoded
app.get("/", (req: Request, res: Response) => {
  return res.send({ response: "Hello World - Typescript" });
});
// oranglain masih bisa melihat photo dan pdf karena belum di authorisasi
app.use("/images", express.static("images"));
// masih bisa melihat pdf karena belum di authorisasi
// irs, khs, berita acara pkl, dan skripsi bocor
app.use("/pdf", express.static("pdf"));
app.use(router);

app.listen(process.env.APP_PORT, () => {
  console.log(
    process.env.APP_NAME + " running on port " + process.env.APP_PORT
  );
});
