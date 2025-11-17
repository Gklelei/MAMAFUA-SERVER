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
exports.AdminDeleteServiceListing = void 0;
const __1 = require("..");
const AdminCreateServiceListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, priceCents, title } = req.body;
    if (!description || !priceCents || !title) {
        res.status(400).json({ message: "Please enter all the fields" });
        return;
    }
    try {
        yield __1.prisma.service.create({
            data: {
                description,
                ownerId: req.userId,
                priceCents: parseInt(priceCents),
                title,
            },
        });
        res.status(200).json({ message: "Service created successfully" });
        return;
    }
    catch (error) {
        console.log({ error });
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
const AdminViewAllServiceListings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listings = yield __1.prisma.service.findMany();
        if (!listings) {
            res.status(404).json({ message: "Not Found" });
            return;
        }
        res.status(200).json(listings);
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
const AdminUpdateServiceListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, durationMin, priceCents } = req.body;
    if (!id || (!title && !description && !durationMin && !priceCents)) {
        res.status(400).json({ message: "Please enter all the fields" });
        return;
    }
    try {
        const ExistingListing = yield __1.prisma.service.findUnique({
            where: {
                id,
            },
        });
        if (!ExistingListing) {
            res.status(404).json({ message: "Listing not found" });
            return;
        }
        const UpdatePyload = {};
        if (title)
            UpdatePyload.title = title;
        if (description)
            UpdatePyload.description = description;
        if (durationMin)
            UpdatePyload.durationMin = durationMin;
        if (priceCents)
            UpdatePyload.priceCents = priceCents;
        yield __1.prisma.service.update({
            where: {
                id: ExistingListing.id,
            },
            data: UpdatePyload,
        });
        res.status(200).json({ message: "Listing updated successfully" });
        return;
    }
    catch (error) {
        console.log({ error });
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
const AdminDeleteServiceListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "Please enter all the fields" });
        return;
    }
    try {
        const ExistingListing = yield __1.prisma.service.findUnique({
            where: {
                id,
            },
        });
        if (!ExistingListing) {
            res.status(404).json({ message: "Listing not found" });
            return;
        }
        yield __1.prisma.service.delete({
            where: {
                id,
            },
        });
        res.status(200).json({ message: "Listing deleted successfully" });
        return;
    }
    catch (error) {
        console.log({ error });
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.AdminDeleteServiceListing = AdminDeleteServiceListing;
exports.default = {
    AdminCreateServiceListing,
    AdminViewAllServiceListings,
    AdminUpdateServiceListing,
    AdminDeleteServiceListing: exports.AdminDeleteServiceListing,
};
