import express, { Request, Response } from "express";
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";
import cookieparser from "cookie-parser";
import AdminAuthRoutes from "./Routes/AdminAuthRoutes";
import AdminRoutes from "./Routes/AdminRoutes";
import UserRoutes from "./Routes/UserRoutes";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import AdminStatsRoutes from "./Routes/AdminStatsRoutes";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieparser());

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "connect-src": [
          "'self'",
          process.env.CLIENT_URL!,
          process.env.ADMIN_URL!,
        ],
        "img-src": ["'self'", "data:", "blob:"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "no-referrer" },
  })
);

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many requests — slow down.",
});

app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_URL!, process.env.ADMIN_URL!],
  })
);
export const prisma = new PrismaClient();

app.get("/hello", (req, res) => {
  res.send("Hello from server");
});

app.use("/api/v1/auth", AdminAuthRoutes);
app.use("/api/v1/time", AdminRoutes);
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/stats", AdminStatsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
