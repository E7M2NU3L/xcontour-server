import http from "http";
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { globalErrHandler } from "./middlewares/global-err";
import AuthRouter from "./routes/auth";
import { dbConnect } from "./config/dbConnect";
import TemplateRouter from "./routes/templates";
import ContractsRouter from "./routes/contracts";
import SuggestionsRouter from "./routes/suggestions";

// dotenv configuration
dotenv.config();

// port
const port = process.env.PORT || 5000;

// express app instance
const app = express();

// db connection
dbConnect();

// app middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(cors());
app.use(morgan('dev'));

// custom middlewares
app.use(globalErrHandler);

// server
const server = http.createServer(app);

// routes
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/templates", TemplateRouter);
app.use("/api/v1/contracts", ContractsRouter);
app.use("/api/v1/suggestions", SuggestionsRouter);

// starting the server
server.listen(port, () => {
    console.log(`app is running on the port: ${port}`);
});