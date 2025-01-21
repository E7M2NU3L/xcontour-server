import http from "http";
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieSession from 'cookie-session'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { globalErrHandler } from "./middlewares/global-err";
import AuthRouter from "./routes/auth";
import { dbConnect } from "./config/dbConnect";
import TemplateRouter from "./routes/templates";
import ContractsRouter from "./routes/contracts";
import SuggestionsRouter from "./routes/suggestions";
import session from 'express-session';
import passport from 'passport';
import { initPassport } from './config/passport_connect';
import { OverviewRouter } from "./routes/overview";

// dotenv configuration
dotenv.config();
initPassport();

// port
const port = process.env.PORT || 5000;

// express app instance
const app = express();

// db connection
dbConnect();

// app middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['xcontour'],
    maxAge : 24 * 60 * 60 * 100
}));
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    name : "user",
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 3,
    }
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    credentials : true,
    origin : 'https://xcontour.vercel.app/',
    methods : "GET,POST,PUT,DELETE"
}));
app.use(morgan('combined'));

// server
const server = http.createServer(app);

// routes // /api/v1/contracts/delete/${id}
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/templates", TemplateRouter);
app.use("/api/v1/contracts", ContractsRouter);
app.use("/api/v1/suggestions", SuggestionsRouter);
app.use("/api/v1/overview", OverviewRouter);

// custom middlewares
app.use(globalErrHandler);

// starting the server
server.listen(port, () => {
    console.log(`app is running on the port: ${port}`);
});