import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      userRole: "ADMIN" | "USER";
    }
  }
}

export const VerifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Token = req.cookies["Bearer"];

    if (!Token) {
      res.status(401).json({ message: "Unauthorized Access" });
      return;
    }

    const decoded = jwt.decode(Token);

    if (!decoded) {
      res.status(401).json({ message: "Unauthorized Access" });
      return;
    }

    req.userId = (decoded as JwtPayload).userId;
    req.userRole = (decoded as JwtPayload).userRole;

    next();
  } catch (error) {
    console.log({ error });
    res.status(401).json({ message: "Internal Server Error" });
    return;
  }
};
