"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrHandler = globalErrHandler;
function globalErrHandler(err, req, res, next) {
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || "Something went wrong";
    res.status(errStatus).json({
        success: false,
        message: errMsg
    });
}
