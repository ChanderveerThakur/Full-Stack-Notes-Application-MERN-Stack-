const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  path: "/",
};

async function userAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized user",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = { userAuth, cookieOptions };
