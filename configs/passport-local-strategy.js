const passport = require('passport');
const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
    },
    async function (username, password, done) {

        try {
            const user = await User.findOne({ username });

            if (!user) {
                return done(null, false);
            }

            const doesPasswordMatch = await bcrypt.compare(password, user.password);

            if(!doesPasswordMatch){
                return done(null, false);
            }


            done(null, user);
        } catch (error) {
            console.log(`error in passport authentication ${error}`);
            return done(error, false);
        }
    }
));


module.exports = passport;