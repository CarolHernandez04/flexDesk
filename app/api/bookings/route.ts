import type { Session } from "next-auth";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bookingSchema = z.object({
  deskId: z.string(),
  date: z.string().datetime(),
  timeSlot: z.enum(["MORNING", "AFTERNOON", "FULL_DAY"]),
  notes: z.string().optional(),
});

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        desk: {
          select: {
            id: true,
            identifier: true,
            department: true,
            location: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { deskId, date, timeSlot, notes } = bookingSchema.parse(body);

    const desk = await prisma.desk.findUnique({
      where: { id: deskId },
    });

    if (!desk) {
      return NextResponse.json({ error: "Desk not found" }, { status: 404 });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: {
        deskId_date_timeSlot: {
          deskId,
          date: new Date(date),
          timeSlot,
        },
      },
    });

    if (existingBooking && existingBooking.status !== "CANCELLED") {
      return NextResponse.json(
        { error: "Desk already booked for this time slot" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        deskId,
        date: new Date(date),
        timeSlot,
        notes,
        status: "CONFIRMED",
      },
      include: {
        desk: {
          select: {
            identifier: true,
            department: true,
          },
        },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}