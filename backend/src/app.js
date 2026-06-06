const express = require('express')
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const noteRoutes = require("./routes/note.routes");



const app = express();

const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// # Middlewares
app.use(express.json());
app.use(cookieParser());


// Authentication apis
app.use('/api/auth',authRoutes)

// Notes apis

app.use('/api/note/', noteRoutes)


app.get("/", (req, res) => {
  res.send("Notes API Running");
});



module.exports = app