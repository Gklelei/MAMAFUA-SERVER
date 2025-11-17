import { Request, Response } from "express";
import { prisma } from "..";
import { isAfter, isBefore, isEqual, parseISO, startOfDay } from "date-fns";

export const AdminCreateTimeSchedule = async (req: Request, res: Response) => {
  try {
    const { startTime, endTime, date } = req.body as {
      startTime: string;
      endTime: string;
      date: string;
    };

    if (!startTime || !endTime || !date) {
      res.status(400).json({
        message: "Please provide date, startTime, and endTime.",
      });
      return;
    }

    const slotDate = parseISO(date);
    if (isNaN(slotDate.getTime())) {
      res.status(400).json({ message: "Invalid date format." });
      return;
    }

    const now = new Date();
    const today = startOfDay(now);
    const selectedDay = startOfDay(slotDate);

    if (isBefore(selectedDay, today)) {
      res.status(400).json({
        message: "You cannot create an availability slot for a past date.",
      });
      return;
    }

    const start = parseISO(`${date}T${startTime}`);
    const end = parseISO(`${date}T${endTime}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ message: "Invalid time format." });
      return;
    }

    if (!isAfter(end, start)) {
      res.status(400).json({ message: "End time must be after start time." });
      return;
    }

    const isToday = isEqual(selectedDay, today);
    if (isToday && isBefore(start, now)) {
      res.status(400).json({
        message: "Cannot create a slot in the past for today's date.",
      });
      return;
    }

    const overlappingSlot = await prisma.availabilitySlot.findFirst({
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
        message:
          "An availability slot already exists that overlaps this time range.",
      });
      return;
    }

    const schedule = await prisma.availabilitySlot.create({
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
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};

const AdminEditAvailabilitySlot = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { startTime, endTime, date } = req.body as {
    startTime: string;
    endTime: string;
    date: string;
  };

  if (!id || !startTime || !endTime || !date) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const slot = await prisma.availabilitySlot.findUnique({ where: { id } });
    if (!slot) {
      res.status(404).json({ message: "Slot not found." });
      return;
    }

    if (slot.ownerId !== req.userId) {
      res.status(403).json({ message: "Unauthorized: not your slot." });
      return;
    }

    const inputDate = parseISO(date);

    const now = new Date();
    if (isBefore(inputDate, new Date(now.toDateString()))) {
      res.status(400).json({ message: "Cannot set a past date." });
      return;
    }

    const overlappingSlot = await prisma.availabilitySlot.findFirst({
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

    const updated = await prisma.availabilitySlot.update({
      where: { id },
      data: { startTime, endTime, date: inputDate },
    });

    res.status(200).json({ message: "Slot updated successfully.", updated });
    return;
  } catch (error) {
    console.error("Error editing slot:", error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};

const GetAllAvailableSlots = async (req: Request, res: Response) => {
  try {
    const slots = await prisma.availabilitySlot.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default {
  AdminCreateTimeSchedule,
  AdminEditAvailabilitySlot,
  GetAllAvailableSlots,
};
