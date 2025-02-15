"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppErrServer = exports.AppErr = void 0;
const AppErr = (message, statusCode) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    throw err;
};
exports.AppErr = AppErr;
const AppErrServer = (error) => {
    if (error instanceof Error) {
        return (0, exports.AppErr)(error.message, 500);
    }
    else {
        return (0, exports.AppErr)('Something went wrong', 500);
    }
};
exports.AppErrServer = AppErrServer;
