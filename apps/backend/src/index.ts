import express from "express";
import { router } from "./routes";

const app = express();
app.use(express.json());

app.use("/v1",router);

const PORT = 3000;
app.listen(process.env.PORT || PORT,()=>`Server running on ${PORT}`)    