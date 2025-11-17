"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const index_js_1 = require("../generated/prisma/index.js");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const AdminAuthRoutes_1 = __importDefault(require("./Routes/AdminAuthRoutes"));
const AdminRoutes_1 = __importDefault(require("./Routes/AdminRoutes"));
const UserRoutes_1 = __importDefault(require("./Routes/UserRoutes"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const AdminStatsRoutes_1 = __importDefault(require("./Routes/AdminStatsRoutes"));
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "default-src": ["'self'"],
            "connect-src": [
                "'self'",
                process.env.CLIENT_URL,
                process.env.ADMIN_URL,
            ],
            "img-src": ["'self'", "data:", "blob:"],
            "script-src": ["'self'"],
            "style-src": ["'self'", "'unsafe-inline'"],
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "no-referrer" },
}));
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 10,
    message: "Too many requests — slow down.",
});
app.use((0, cors_1.default)({
    credentials: true,
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
}));
exports.prisma = new index_js_1.PrismaClient();
app.get("/hello", (req, res) => {
    res.send("Hello from server");
});
app.use("/api/v1/auth", AdminAuthRoutes_1.default);
app.use("/api/v1/time", AdminRoutes_1.default);
app.use("/api/v1/user", UserRoutes_1.default);
app.use("/api/v1/stats", AdminStatsRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
