const express = require("express");
require("express-async-errors");
const cors = require("cors");
const router = express.Router();
require("dotenv").config();
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const connectDB = require("./db/connect");

const authRouter = require("./routes/auth");

const authenticatedUser = require("./middleware/authentication");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const app = express();

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(xss());

app.use("/api/auth", authRouter);

app.get("/api", (req, res) => {
  res.send("Welcome to the ProgressFit backend");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
