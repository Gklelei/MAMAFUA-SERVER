import { Request, Response } from "express";
import { BookingRequest } from "../../generated/prisma";
import { prisma } from "..";
import { error } from "console";

const CustomersSendBookingRequest = async (req: Request, res: Response) => {
  const {
    customerAddress,
    customerName,
    customerPhone,
    note,
    serviceId,
    ownerId,
  } = req.body as BookingRequest;

  if (
    !customerAddress ||
    !customerName ||
    !customerPhone ||
    !serviceId ||
    !ownerId
  ) {
    res.status(400).json({ message: "Please enter all the fields" });
    return;
  }

  try {
    const existingService = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

    if (!existingService) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    const bookingRequest = await prisma.bookingRequest.create({
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
      .json(
        bookingRequest && { message: "Your request has been sent successfully" }
      );
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const AdminChangeBookingRequestStatus = async (req: Request, res: Response) => {
  const { status } = req.body as Pick<BookingRequest, "status">;
  const { id } = req.params as { id: string };

  if (!status || !id) {
    res.status(400).json({ message: "Please enter all the fields" });
    return;
  }

  try {
    const existingBookingRequest = await prisma.bookingRequest.findUnique({
      where: {
        id,
      },
    });

    if (!existingBookingRequest) {
      res.status(404).json({ message: "Booking request not found" });
      return;
    }

    await prisma.bookingRequest.update({
      where: {
        id: existingBookingRequest.id,
      },
      data: {
        status,
      },
    });

    res.status(200).json({ message: "Status updated successfully" });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const AdminViewRequests = async (req: Request, res: Response) => {
  try {
    const AllBookingRequests = await prisma.bookingRequest.findMany({
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
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const AdminAddOrEditNote = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const { note } = req.body as {
    note: string;
  };

  if (!id || !note) {
    res.status(400).json({ message: "Please enter all the fields" });
    return;
  }

  try {
    const existingRequest = await prisma.bookingRequest.findUnique({
      where: {
        id,
      },
    });

    if (!existingRequest) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    await prisma.bookingRequest.update({
      where: {
        id: existingRequest.id,
      },
      data: {
        note,
      },
    });

    res.status(200).json({ message: "Note updated successfully" });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const AdminDeleteServiceRequest = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!id) {
    res.status(400).json({ message: "Please enter all the fields" });
    return;
  }
  try {
    const existingBookingRequest = await prisma.bookingRequest.findUnique({
      where: {
        id,
      },
    });

    if (!existingBookingRequest) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    await prisma.bookingRequest.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ message: "Request deleted successfully" });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default {
  CustomersSendBookingRequest,
  AdminChangeBookingRequestStatus,
  AdminViewRequests,
  AdminAddOrEditNote,
  AdminDeleteServiceRequest,
};
