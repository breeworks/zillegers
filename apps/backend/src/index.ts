import express from "express";
import { router } from "./routes";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/v1",router);

const PORT = 3000;
app.listen(process.env.PORT || PORT,()=>`Server running on ${PORT}`)    