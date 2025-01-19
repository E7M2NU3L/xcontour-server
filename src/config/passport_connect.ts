import passport, { Profile } from "passport";
import { Strategy } from "passport-google-oauth20";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = '/api/v1/auth/callback/google';

export const initPassport  = () => {
    const GoogleStrategy = Strategy;
    passport.use(new GoogleStrategy({
        clientID: CLIENT_ID || '',
        clientSecret: CLIENT_SECRET || '',
        callbackURL: REDIRECT_URI || '',
        scope : ['profile', 'email']
    },
    function(accessToken : string, refreshToken : string, profile : Profile, done : any) {
        const userProfile=profile;
        console.log(userProfile);
        return done(null, userProfile);
    }
    ));

    passport.serializeUser((user, cb) => {
        cb(null, user);
    });
      
    passport.deserializeUser(function(obj : any, cb) {
        cb(null, obj);
    });

    console.log("Passport Configuration completed");
};