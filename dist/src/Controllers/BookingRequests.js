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
const CustomersSendBookingRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerAddress, customerName, customerPhone, note, serviceId, ownerId, } = req.body;
    if (!customerAddress ||
        !customerName ||
        !customerPhone ||
        !serviceId ||
        !ownerId) {
        res.status(400).json({ message: "Please enter all the fields" });
        return;
    }
    try {
        const existingService = yield __1.prisma.service.findUnique({
            where: {
                id: serviceId,
            },
        });
        if (!existingService) {
            res.status(404).json({ message: "Service not found" });
            return;
        }
        const bookingRequest = yield __1.prisma.bookingRequest.create({
            data: {
                customerAddress,
                customerName,
                customerPhone,
                note,
                ownerId,
                serviceId,
            },
        });
        res
            .status(201)
            .json(bookingRequest && { message: "Your request has been sent successfully" });
        return;
    }
    catch (error) {
        console.log({ error });
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
const AdminChangeBookingRequestStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body;
    const { id } = req.params;
    if (!status || !id) {
        res.status(400).json({ message: "Please enter all the fields" });
        return;
    }
    try {
        const existingBookingRequest = yield __1.prisma.bookingRequest.findUnique({
            where: {
                id,
            },
        });
        if (!existingBookingRequest) {
            res.status(404).json({ message: "Booking request not found" });
            return;
        }
        yield __1.prisma.bookingRequest.update({
            where: {
                id: existingBookingRequest.id,
            },
            data: {
                status,
            },
        });
        res.status(200).json({ message: "Status updated successfully" });
        return;
    }
    catch (error) {
        console.log({ error });
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
const AdminViewRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const AllBookingRequests = yield __1.prisma.bookingRequest.findMany({
            include: {
                service: {
                    select: {
                        title: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (!AllBookingRequests) {
            res.status(404).json({ message: "No requests found" });
            return;
        }
        res.status(200).json(AllBookingRequests);
        return;
    }
    catch (error) {
        console.log({ error });
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
const AdminAddOrEditNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { note } = req.body;
    if (!id || !note) {
        res.status(400).json({ message: "Please enter all the fields" });
        return;
    }
    try {
        const existingRequest = yield __1.prisma.bookingRequest.findUnique({
            where: {
                id,
            },
        });
        if (!existingRequest) {
            res.status(404).json({ message: "Request not found" });
            return;
        }
        yield __1.prisma.bookingRequest.update({
            where: {
                id: existingRequest.id,
            },
            data: {
                note,
            },
        });
        res.status(200).json({ message: "Note updated successfully" });
        return;
    }
    catch (error) {
        console.log({ error });
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
const AdminDeleteServiceRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "Please enter all the fields" });
        return;
    }
    try {
        const existingBookingRequest = yield __1.prisma.bookingRequest.findUnique({
            where: {
                id,
            },
        });
        if (!existingBookingRequest) {
            res.status(404).json({ message: "Request not found" });
            return;
        }
        yield __1.prisma.bookingRequest.delete({
            where: {
                id,
            },
        });
        res.status(200).json({ message: "Request deleted successfully" });
        return;
    }
    catch (error) {
        console.log({ error });
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.default = {
    CustomersSendBookingRequest,
    AdminChangeBookingRequestStatus,
    AdminViewRequests,
    AdminAddOrEditNote,
    AdminDeleteServiceRequest,
};
