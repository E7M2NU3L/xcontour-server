"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = '/api/v1/auth/callback/google';
const initPassport = () => {
    const GoogleStrategy = passport_google_oauth20_1.Strategy;
    passport_1.default.use(new GoogleStrategy({
        clientID: CLIENT_ID || '',
        clientSecret: CLIENT_SECRET || '',
        callbackURL: REDIRECT_URI || '',
        scope: ['profile', 'email']
    }, function (accessToken, refreshToken, profile, done) {
        const userProfile = profile;
        console.log(userProfile);
        return done(null, userProfile);
    }));
    passport_1.default.serializeUser((user, cb) => {
        cb(null, user);
    });
    passport_1.default.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });
    console.log("Passport Configuration completed");
};
exports.initPassport = initPassport;
