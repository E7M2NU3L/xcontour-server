"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConnect = async () => {
    const mongoURI = process.env.MONGO_URI;
    console.log(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    mongoose_1.default.connect(mongoURI).then(() => {
        console.log("Connected to the Database");
    }).catch((err) => {
        console.log(err);
    });
};
exports.dbConnect = dbConnect;
