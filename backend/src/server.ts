import express, { json } from "express";
import router from "./Routes/router";
import cors from 'cors'
// import router from "./Routes/project_routes";

const app = express();
app

app.use(json());

app.use(cors())

app.use("/users", router);
// app.use("/", router);

app.listen(5050, () => {
  console.log("server is running");
});