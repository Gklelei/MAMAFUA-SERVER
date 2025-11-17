"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = require("../Middlewares/Auth");
const AdminStats_1 = __importDefault(require("../Controllers/AdminStats"));
const router = (0, express_1.Router)();
router.get("/all-stats", Auth_1.VerifyToken, AdminStats_1.default.AdminGetRequestStats);
exports.default = router;
