import express from "express";
import { VerifyToken } from "../Middlewares/Auth";
import AdminCreateTimeSchedule from "../Controllers/AdminCreateTimeSchedule";
import AdminCreateService from "../Controllers/AdminCreateService";
import BookingRequests from "../Controllers/BookingRequests";

const router = express.Router();

router.post(
  "/create/time-slot",
  VerifyToken,
  AdminCreateTimeSchedule.AdminCreateTimeSchedule
);

router.put(
  "/update/time-slot/:id",
  VerifyToken,
  AdminCreateTimeSchedule.AdminEditAvailabilitySlot
);

router.post(
  "/create/service-listing",
  VerifyToken,
  AdminCreateService.AdminCreateServiceListing
);

router.delete(
  "/delete-listing/:id",
  VerifyToken,
  AdminCreateService.AdminDeleteServiceListing
);

router.put(
  "/update-listing/:id",
  VerifyToken,
  AdminCreateService.AdminUpdateServiceListing
);

router.get("/listings/all", AdminCreateService.AdminViewAllServiceListings);

router.get("/all-requests", VerifyToken, BookingRequests.AdminViewRequests);
export default router;

router.put("/add-note/:id", VerifyToken, BookingRequests.AdminAddOrEditNote);
router.delete(
  "/delete-service/:id",
  VerifyToken,
  BookingRequests.AdminDeleteServiceRequest
);

router.put(
  "/change-status/:id",
  VerifyToken,
  BookingRequests.AdminChangeBookingRequestStatus
);
