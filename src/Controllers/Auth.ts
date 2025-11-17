import type { Request, Response } from "express";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "..";

const UseAdminAuthentication = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      res.status(400).json({ message: "Please enter email and password" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (!user || user.role !== "ADMIN") {
      res.status(400).json({
        message:
          "Invalid Credentials, Plaese check your email and password and try again",
      });
      return;
    }

    const isPwd = compare(password, user.password || "");

    if (!isPwd) {
      res.status(400).json({
        message:
          "Invalid Credentials, Plaese check your email and password and try again",
      });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, userRole: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("Bearer", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 86400000,
    });

    res.status(200).json({ message: "Login successful" });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export default { UseAdminAuthentication };
