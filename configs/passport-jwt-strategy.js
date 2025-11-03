const passport = require('passport');
const User = require('../models/User');
const JWTStrategy = require('passport-jwt').Strategy;
const Extractor = require('passport-jwt').ExtractJwt;

passport.use(new JWTStrategy(
    {
        jwtFromRequest: Extractor.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.PASSPORT_JWT_SECRET
    },
    async function (payload, done) {
        try {

            const user = await User.findById(payload._id)?.select('-password');
            if (!user) { return done(null, false) }
            return done(null, user);

        } catch (error) {

            console.log(`error in jwt authentication ${error}`);
            return done(error, false);

        }

    }
));


module.exports = passport;
