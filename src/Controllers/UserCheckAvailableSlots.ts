import { Request, Response } from "express";
import { prisma } from "../index";
import {
  parseISO,
  isBefore,
  startOfDay,
  isAfter,
  startOfToday,
} from "date-fns";

const UserSearchAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { date, startTime, endTime } = req.query as {
      date: string;
      startTime?: string;
      endTime?: string;
    };

    if (!date) {
      res.status(400).json({
        message: "Please provide a valid date.",
      });
      return;
    }

    const parsedDate = parseISO(date as string);
    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({ message: "Invalid date format." });
      return;
    }

    const now = new Date();
    const today = startOfDay(now);
    const selectedDay = startOfDay(parsedDate);

    if (isBefore(selectedDay, today)) {
      res.status(400).json({
        message: "You cannot search for slots in the past.",
      });
      return;
    }

    let startDateTime: Date | undefined;
    let endDateTime: Date | undefined;

    if (startTime) startDateTime = parseISO(`${date}T${startTime}`);
    if (endTime) endDateTime = parseISO(`${date}T${endTime}`);

    if (startDateTime && isNaN(startDateTime.getTime())) {
      res.status(400).json({ message: "Invalid startTime format." });
      return;
    }

    if (endDateTime && isNaN(endDateTime.getTime())) {
      res.status(400).json({ message: "Invalid endTime format." });
      return;
    }

    const timeFilters =
      startTime && endTime
        ? {
            startTime: { gte: startTime },
            endTime: { lte: endTime },
          }
        : startTime
          ? { startTime: { gte: startTime } }
          : endTime
            ? { endTime: { lte: endTime } }
            : {};

    const availableSlots = await prisma.availabilitySlot.findMany({
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
  } catch (error) {
    console.error("Error searching available slots:", error);
    res.status(500).json({
      message: "Internal server error.",
    });
    return;
  }
};

const UserViewAllAvailableSlots = async (req: Request, res: Response) => {
  const today = startOfToday();
  try {
    const Slots = await prisma.availabilitySlot.findMany({
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
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export default { UserSearchAvailableSlots, UserViewAllAvailableSlots };
