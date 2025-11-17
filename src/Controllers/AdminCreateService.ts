import { Request, Response } from "express";
import { prisma } from "..";
import { title } from "process";

const AdminCreateServiceListing = async (req: Request, res: Response) => {
  const { description, priceCents, title } = req.body as {
    title: string;
    description: string | null;
    durationMin: number;
    priceCents: string | null;
  };

  if (!description || !priceCents || !title) {
    res.status(400).json({ message: "Please enter all the fields" });
    return;
  }

  try {
    await prisma.service.create({
      data: {
        description,
        ownerId: req.userId,
        priceCents: parseInt(priceCents),
        title,
      },
    });

    res.status(200).json({ message: "Service created successfully" });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

const AdminViewAllServiceListings = async (req: Request, res: Response) => {
  try {
    const listings = await prisma.service.findMany();

    if (!listings) {
      res.status(404).json({ message: "Not Found" });
      return;
    }

    res.status(200).json(listings);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

const AdminUpdateServiceListing = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { title, description, durationMin, priceCents } = req.body as Partial<{
    title: string;
    description: string;
    durationMin: number;
    priceCents: number;
  }>;

  if (!id || (!title && !description && !durationMin && !priceCents)) {
    res.status(400).json({ message: "Please enter all the fields" });
    return;
  }

  try {
    const ExistingListing = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!ExistingListing) {
      res.status(404).json({ message: "Listing not found" });
      return;
    }

    const UpdatePyload: {
      title?: string;
      description?: string;
      durationMin?: number;
      priceCents?: number;
    } = {};

    if (title) UpdatePyload.title = title;
    if (description) UpdatePyload.description = description;
    if (durationMin) UpdatePyload.durationMin = durationMin;
    if (priceCents) UpdatePyload.priceCents = priceCents;

    await prisma.service.update({
      where: {
        id: ExistingListing.id,
      },
      data: UpdatePyload,
    });

    res.status(200).json({ message: "Listing updated successfully" });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const AdminDeleteServiceListing = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params as { id: string };

  if (!id) {
    res.status(400).json({ message: "Please enter all the fields" });
    return;
  }

  try {
    const ExistingListing = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!ExistingListing) {
      res.status(404).json({ message: "Listing not found" });
      return;
    }

    await prisma.service.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ message: "Listing deleted successfully" });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export default {
  AdminCreateServiceListing,
  AdminViewAllServiceListings,
  AdminUpdateServiceListing,
  AdminDeleteServiceListing,
};
