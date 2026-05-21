import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import "dotenv/config";
import { initDB, pool } from "./db/index.js";
import { userRoute } from "./modules/user/user.route.js";
import { profileRoute } from "./modules/profile/profile.route.js";
import { authRoute } from "./modules/auth/auth.route.js";
import logger from "./middleware/logger.js";
import CookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler.js";

const app: Application = express();

// middleware
app.use(CookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
// app.use(logger);

// const corsOptions = {
//   origin: "http://localhost:5000",
// };

// app.use(cors(corsOptions));
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Express Js",
  });
});

app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute);

app.use(globalErrorHandler);

export default app;
