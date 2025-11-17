"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = __importDefault(require("../Controllers/Auth"));
const Auth_2 = require("../Middlewares/Auth");
const router = (0, express_1.Router)();
router.post("/sign-in", Auth_1.default.UseAdminAuthentication);
router.post("/sign-out", Auth_2.VerifyToken, (req, res) => {
    res.clearCookie("Bearer");
    res.status(200).json({ message: "Logout Success" });
    return;
});
router.get("/verify-token", Auth_2.VerifyToken, (req, res) => {
    try {
        const userId = req.userId;
        console.log(userId);
        if (!userId) {
            res.status(401).json({ message: "Unauthorized Access" });
            return;
        }
        res.status(200).json({ userId });
        return;
    }
    catch (error) {
        console.log({ error });
        res.status(401).json({ message: "Internal Server Error" });
        return;
    }
});
exports.default = router;
