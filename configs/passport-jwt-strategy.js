import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PASSPORT_JWT_SECRET,
};


passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await User.findById(payload._id).select("-password");
      if (!user) return done(null, false);

      return done(null, user);
    } catch (error) {
      console.log(`❌ JWT auth error: ${error}`);
      return done(error, false);
    }
  })
);

export default passport;
