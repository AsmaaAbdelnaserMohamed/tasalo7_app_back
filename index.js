import express from "express";
import { dbConnection } from "./Database/db_connection.js";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/modules/guidreportrsc/guidreportrsc.routes.js";
import routerAuth from "./src/modules/user/user.routes.js";
import listRouter from "./src/modules/listData/listdata.routes.js";
import { globalError } from "./src/middleware/globalErrorHandling.js";

const app = express();
const port = process.env.PORT || 4500;

dotenv.config();
dbConnection();

app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());
app.use(router);
app.use(routerAuth);
app.use(listRouter);
app.use(globalError)
app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});
