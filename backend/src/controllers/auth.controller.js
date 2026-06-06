const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { cookieOptions } = require("../middlewares/auth.middleware");

function generateUsername(email, fullName) {
  const emailPrefix = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
  const nameSlug = fullName.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  return nameSlug || emailPrefix || "user";
}

async function ensureUniqueUsername(baseUsername) {
  let username = baseUsername;
  let counter = 1;

  while (await userModel.findOne({ username })) {
    username = `${baseUsername}${counter}`;
    counter += 1;
  }

  return username;
}

function setAuthCookie(res, userId) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ email: email.toLowerCase() }],
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "An account with this email already exists",
      });
    }

    const baseUsername = generateUsername(email, fullName);
    const username = await ensureUniqueUsername(baseUsername);
    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName: fullName.trim(),
      username,
      email: email.toLowerCase().trim(),
      password: hash,
    });

    setAuthCookie(res, user._id);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to register user",
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    setAuthCookie(res, user._id);

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to login",
    });
  }
}

async function logoutUser(req, res) {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({
    message: "User logged out successfully",
  });
}

async function getCurrentUser(req, res) {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("fullName email username");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch user",
    });
  }
}

module.exports = { registerUser, loginUser, logoutUser, getCurrentUser };
