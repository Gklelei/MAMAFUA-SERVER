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
const index_1 = require("../index");
const date_fns_1 = require("date-fns");
const UserSearchAvailableSlots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, startTime, endTime } = req.query;
        if (!date) {
            res.status(400).json({
                message: "Please provide a valid date.",
            });
            return;
        }
        const parsedDate = (0, date_fns_1.parseISO)(date);
        if (isNaN(parsedDate.getTime())) {
            res.status(400).json({ message: "Invalid date format." });
            return;
        }
        const now = new Date();
        const today = (0, date_fns_1.startOfDay)(now);
        const selectedDay = (0, date_fns_1.startOfDay)(parsedDate);
        if ((0, date_fns_1.isBefore)(selectedDay, today)) {
            res.status(400).json({
                message: "You cannot search for slots in the past.",
            });
            return;
        }
        let startDateTime;
        let endDateTime;
        if (startTime)
            startDateTime = (0, date_fns_1.parseISO)(`${date}T${startTime}`);
        if (endTime)
            endDateTime = (0, date_fns_1.parseISO)(`${date}T${endTime}`);
        if (startDateTime && isNaN(startDateTime.getTime())) {
            res.status(400).json({ message: "Invalid startTime format." });
            return;
        }
        if (endDateTime && isNaN(endDateTime.getTime())) {
            res.status(400).json({ message: "Invalid endTime format." });
            return;
        }
        const timeFilters = startTime && endTime
            ? {
                startTime: { gte: startTime },
                endTime: { lte: endTime },
            }
            : startTime
                ? { startTime: { gte: startTime } }
                : endTime
                    ? { endTime: { lte: endTime } }
                    : {};
        const availableSlots = yield index_1.prisma.availabilitySlot.findMany({
            where: {
                AND: [
                    { date: selectedDay },
                    {
                        OR: [
                            { date: { gt: today } },
                            {
                                date: today,
                                endTime: { gt: now.toTimeString().slice(0, 5) },
                            },
                        ],
                    },
                    timeFilters,
                ],
            },
            orderBy: {
                startTime: "asc",
            },
        });
        if (availableSlots.length === 0) {
            res.status(404).json({
                message: "No available slots found for the specified date/time range.",
            });
            return;
        }
        res.status(200).json({
            message: "Available slots retrieved successfully.",
            data: availableSlots,
        });
        return;
    }
    catch (error) {
        console.error("Error searching available slots:", error);
        res.status(500).json({
            message: "Internal server error.",
        });
        return;
    }
});
const UserViewAllAvailableSlots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = (0, date_fns_1.startOfToday)();
    try {
        const Slots = yield index_1.prisma.availabilitySlot.findMany({
            where: {
                date: {
                    gte: today,
                },
            },
            orderBy: {
                startTime: "asc",
            },
        });
        res.status(200).json(Slots);
        return;
    }
    catch (error) {
        console.log({ error });
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.default = { UserSearchAvailableSlots, UserViewAllAvailableSlots };
