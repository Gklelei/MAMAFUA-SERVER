import express from "express";
import UserCheckAvailableSlots from "../Controllers/UserCheckAvailableSlots";
import BookingREquests from "../Controllers/BookingRequests";

const router = express.Router();

router.get(
  "/available/time-slot",
  UserCheckAvailableSlots.UserSearchAvailableSlots
);
router.post(
  "/create/service-request",
  BookingREquests.CustomersSendBookingRequest
);

router.get("/slots/all", UserCheckAvailableSlots.UserViewAllAvailableSlots);
export default router;
