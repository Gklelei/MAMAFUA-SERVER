import { Router } from "express";
import { VerifyToken } from "../Middlewares/Auth";
import AdminStats from "../Controllers/AdminStats";

const router = Router();

router.get("/all-stats", VerifyToken, AdminStats.AdminGetRequestStats);

export default router;
