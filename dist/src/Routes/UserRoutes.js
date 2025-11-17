"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserCheckAvailableSlots_1 = __importDefault(require("../Controllers/UserCheckAvailableSlots"));
const BookingRequests_1 = __importDefault(require("../Controllers/BookingRequests"));
const router = express_1.default.Router();
router.get("/available/time-slot", UserCheckAvailableSlots_1.default.UserSearchAvailableSlots);
router.post("/create/service-request", BookingRequests_1.default.CustomersSendBookingRequest);
router.get("/slots/all", UserCheckAvailableSlots_1.default.UserViewAllAvailableSlots);
exports.default = router;
