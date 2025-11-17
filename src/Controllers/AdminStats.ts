import { Request, Response } from "express";
import { prisma } from "..";
import { endOfWeek, startOfWeek, subWeeks } from "date-fns";

const AdminGetRequestStats = async (req: Request, res: Response) => {
  const now = new Date();

  const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const previousWeekStart = subWeeks(currentWeekStart, 1);
  const previousWeekEnd = subWeeks(currentWeekEnd, 1);

  try {
    const totalRequests = await prisma.bookingRequest.count();
    const currentWeekRequests = await prisma.bookingRequest.count({
      where: {
        requestedAt: {
          gte: currentWeekStart,
          lte: currentWeekEnd,
        },
      },
    });

    const previousWeekRequests = await prisma.bookingRequest.count({
      where: {
        requestedAt: {
          gte: previousWeekStart,
          lte: previousWeekEnd,
        },
      },
    });

    const completedRequests = await prisma.bookingRequest.count({
      where: {
        status: "COMPLETED",
      },
    });

    res.status(200).json({
      totalRequests,
      completedRequests,
      currentWeekRequests,
      previousWeekRequests,
    });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export default { AdminGetRequestStats };
