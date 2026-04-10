import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const department = searchParams.get("department");

    // Build query filter
    const where: any = {};
    if (department) {
      where.department = department;
    }

    const desks = await prisma.desk.findMany({
      where,
      select: {
        id: true,
        identifier: true,
        status: true,
        department: true,
        location: true,
        features: true,
        bookings: {
          where: date
            ? {
                date: {
                  gte: new Date(date),
                  lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
                },
              }
            : undefined,
          select: {
            id: true,
            timeSlot: true,
            status: true,
            userId: true,
          },
        },
      },
    });

    return NextResponse.json(desks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch desks" },
      { status: 500 }
    );
  }
}
