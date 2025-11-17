"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("..");
const UseAdminAuthentication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Please enter email and password" });
            return;
        }
        const user = yield __1.prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive",
                },
            },
        });
        if (!user || user.role !== "ADMIN") {
            res.status(400).json({
                message: "Invalid Credentials, Plaese check your email and password and try again",
            });
            return;
        }
        const isPwd = (0, bcryptjs_1.compare)(password, user.password || "");
        if (!isPwd) {
            res.status(400).json({
                message: "Invalid Credentials, Plaese check your email and password and try again",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, userRole: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.cookie("Bearer", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 86400000,
        });
        res.status(200).json({ message: "Login successful" });
        return;
    }
    catch (error) {
        console.log({ error });
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.default = { UseAdminAuthentication };
