const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, API_PORT } = process.env;

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `http://localhost:${API_PORT}/auth/google/callback`
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile);
        }))

    passport.serializeUser((user, done) => done(null, user));

    passport.deserializeUser((id, done) => {
        user.findById(id, (err, user) => done(err, user));
    })
}