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
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const date_fns_1 = require("date-fns");
const AdminGetRequestStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const currentWeekStart = (0, date_fns_1.startOfWeek)(now, { weekStartsOn: 1 });
    const currentWeekEnd = (0, date_fns_1.endOfWeek)(now, { weekStartsOn: 1 });
    const previousWeekStart = (0, date_fns_1.subWeeks)(currentWeekStart, 1);
    const previousWeekEnd = (0, date_fns_1.subWeeks)(currentWeekEnd, 1);
    try {
        const totalRequests = yield __1.prisma.bookingRequest.count();
        const currentWeekRequests = yield __1.prisma.bookingRequest.count({
            where: {
                requestedAt: {
                    gte: currentWeekStart,
                    lte: currentWeekEnd,
                },
            },
        });
        const previousWeekRequests = yield __1.prisma.bookingRequest.count({
            where: {
                requestedAt: {
                    gte: previousWeekStart,
                    lte: previousWeekEnd,
                },
            },
        });
        const completedRequests = yield __1.prisma.bookingRequest.count({
            where: {
                status: "COMPLETED",
            },
        });
        res.status(200).json({
            totalRequests,
            completedRequests,
            currentWeekRequests,
            previousWeekRequests,
        });
        return;
    }
    catch (error) {
        console.log({ error });
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.default = { AdminGetRequestStats };
