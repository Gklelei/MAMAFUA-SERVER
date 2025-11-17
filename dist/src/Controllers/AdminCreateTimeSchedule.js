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
exports.AdminCreateTimeSchedule = void 0;
const __1 = require("..");
const date_fns_1 = require("date-fns");
const AdminCreateTimeSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startTime, endTime, date } = req.body;
        if (!startTime || !endTime || !date) {
            res.status(400).json({
                message: "Please provide date, startTime, and endTime.",
            });
            return;
        }
        const slotDate = (0, date_fns_1.parseISO)(date);
        if (isNaN(slotDate.getTime())) {
            res.status(400).json({ message: "Invalid date format." });
            return;
        }
        const now = new Date();
        const today = (0, date_fns_1.startOfDay)(now);
        const selectedDay = (0, date_fns_1.startOfDay)(slotDate);
        if ((0, date_fns_1.isBefore)(selectedDay, today)) {
            res.status(400).json({
                message: "You cannot create an availability slot for a past date.",
            });
            return;
        }
        const start = (0, date_fns_1.parseISO)(`${date}T${startTime}`);
        const end = (0, date_fns_1.parseISO)(`${date}T${endTime}`);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            res.status(400).json({ message: "Invalid time format." });
            return;
        }
        if (!(0, date_fns_1.isAfter)(end, start)) {
            res.status(400).json({ message: "End time must be after start time." });
            return;
        }
        const isToday = (0, date_fns_1.isEqual)(selectedDay, today);
        if (isToday && (0, date_fns_1.isBefore)(start, now)) {
            res.status(400).json({
                message: "Cannot create a slot in the past for today's date.",
            });
            return;
        }
        const overlappingSlot = yield __1.prisma.availabilitySlot.findFirst({
            where: {
                ownerId: req.userId,
                date: selectedDay,
                OR: [
                    {
                        AND: [
                            { startTime: { lte: endTime } },
                            { endTime: { gte: startTime } },
                        ],
                    },
                ],
            },
        });
        if (overlappingSlot) {
            res.status(409).json({
                message: "An availability slot already exists that overlaps this time range.",
            });
            return;
        }
        const schedule = yield __1.prisma.availabilitySlot.create({
            data: {
                ownerId: req.userId,
                date: selectedDay,
                startTime,
                endTime,
            },
        });
        res.status(201).json({
            message: "Schedule created successfully.",
            data: schedule,
        });
        return;
    }
    catch (error) {
        console.error("Error creating schedule:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
});
exports.AdminCreateTimeSchedule = AdminCreateTimeSchedule;
const AdminEditAvailabilitySlot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { startTime, endTime, date } = req.body;
    if (!id || !startTime || !endTime || !date) {
        res.status(400).json({ message: "Missing required fields." });
        return;
    }
    try {
        const slot = yield __1.prisma.availabilitySlot.findUnique({ where: { id } });
        if (!slot) {
            res.status(404).json({ message: "Slot not found." });
            return;
        }
        if (slot.ownerId !== req.userId) {
            res.status(403).json({ message: "Unauthorized: not your slot." });
            return;
        }
        const inputDate = (0, date_fns_1.parseISO)(date);
        const now = new Date();
        if ((0, date_fns_1.isBefore)(inputDate, new Date(now.toDateString()))) {
            res.status(400).json({ message: "Cannot set a past date." });
            return;
        }
        const overlappingSlot = yield __1.prisma.availabilitySlot.findFirst({
            where: {
                ownerId: req.userId,
                date: inputDate,
                id: { not: id },
                OR: [
                    {
                        startTime: { lte: endTime },
                        endTime: { gte: startTime },
                    },
                ],
            },
        });
        if (overlappingSlot) {
            res.status(400).json({ message: "Time overlaps with another slot." });
            return;
        }
        const updated = yield __1.prisma.availabilitySlot.update({
            where: { id },
            data: { startTime, endTime, date: inputDate },
        });
        res.status(200).json({ message: "Slot updated successfully.", updated });
        return;
    }
    catch (error) {
        console.error("Error editing slot:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
});
const GetAllAvailableSlots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slots = yield __1.prisma.availabilitySlot.findMany({
            where: {
                date: {
                    gte: new Date(),
                },
            },
            orderBy: {
                startTime: "asc",
            },
        });
    }
    catch (error) {
        console.log({ error });
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.default = {
    AdminCreateTimeSchedule: exports.AdminCreateTimeSchedule,
    AdminEditAvailabilitySlot,
    GetAllAvailableSlots,
};
