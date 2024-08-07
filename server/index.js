import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import routes from "./routes/index.js";
import { dbConnection } from "./utils/index.js";
import { routeNotFound, errorHandler } from "./middleware/errorMiddlewares.js";

dotenv.config();

dbConnection();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: [
      "https://ataskmanager.netlify.app",
      "https://taskmanager-5c7k.onrender.com"
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true, // Ensure cookies are allowed
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://ataskmanager.netlify.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));
app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
