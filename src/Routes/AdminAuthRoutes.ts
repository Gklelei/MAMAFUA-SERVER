import { Request, Response, Router } from "express";
import Auth from "../Controllers/Auth";
import { VerifyToken } from "../Middlewares/Auth";

const router = Router();

router.post("/sign-in", Auth.UseAdminAuthentication);
router.post("/sign-out", VerifyToken, (req: Request, res: Response) => {
  res.clearCookie("Bearer");
  res.status(200).json({ message: "Logout Success" });
  return;
});

router.get("/verify-token", VerifyToken, (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    console.log(userId);
    if (!userId) {
      res.status(401).json({ message: "Unauthorized Access" });
      return;
    }

    res.status(200).json({ userId });
    return;
  } catch (error) {
    console.log({ error });
    res.status(401).json({ message: "Internal Server Error" });
    return;
  }
});

export default router;
