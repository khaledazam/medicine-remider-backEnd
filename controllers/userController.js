const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// REGISTER USER
module.exports.create = async (req, res) => {
  try {
    const { password, cpassword, username, firstname, lastname } = req.body;

    // Validation
    if (!username || !firstname || !lastname || !password || !cpassword) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    if (password !== cpassword) {
      return res.status(400).json({
        message: "Password and confirm password must match",
        success: false,
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({
        message: "Username is already taken",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS)
    );

    const newUser = await User.create({
      username,
      firstname,
      lastname,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { _id: newUser._id },
      process.env.PASSPORT_JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Registration successful",
      success: true,
      jwtToken: token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
      },
    });
  } catch (error) {
    console.log(`Error in creating user: ${error}`);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// =======================
// LOGIN — createSession()
// =======================
module.exports.createSession = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Invalid username or password",
      success: false,
    });
  }

  const token = jwt.sign(
    { _id: req.user._id },
    process.env.PASSPORT_JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    message: "Login successful",
    success: true,
    jwtToken: token,
    user: {
      _id: req.user._id,
      username: req.user.username,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
    },
  });
};

// =======================
// PROFILE
// =======================
module.exports.profile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unable to find user",
      success: false,
    });
  }

  return res.status(200).json(req.user);
};

// =======================
// USER NOT FOUND
// =======================
module.exports.userNotFound = (req, res) => {
  return res.status(401).json({
    message: "Unable to find user",
    success: false,
  });
};
