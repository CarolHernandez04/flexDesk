"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";

type ExistingBooking = {
  id: string;
  timeSlot: string;
  status: string;
};

function error(message: string) {
  return {
    success: false as const,
    error: message,
  };
}

export async function createBookingAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = bookingSchema.safeParse({
    deskId: formData.get("deskId"),
    date: formData.get("date"),
    timeSlot: formData.get("timeSlot"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return error(
      parsed.error.issues[0]?.message || "Invalid booking data"
    );
  }

  const { deskId, date, timeSlot, notes } = parsed.data;

  const bookingDate = new Date(`${date}T00:00:00.000Z`);

  const desk = await prisma.desk.findUnique({
    where: {
      id: deskId,
    },
  });

  if (!desk) {
    return error("Desk not found");
  }

  const dayStatus = await prisma.deskDayStatus.findUnique({
    where: {
      deskId_date: {
        deskId,
        date: bookingDate,
      },
    },
  });

  const effectiveStatus = dayStatus?.status || desk.status;

  if (effectiveStatus !== "AVAILABLE") {
    return error("This desk is not available on this date");
  }

  const existingBookings: ExistingBooking[] =
    await prisma.booking.findMany({
      where: {
        deskId,
        date: bookingDate,
      },
      select: {
        id: true,
        timeSlot: true,
        status: true,
      },
    });

  const activeBookings = existingBookings.filter(
    (booking) => booking.status !== "CANCELLED"
  );

  const hasConflict = activeBookings.some((booking) => {
    if (timeSlot === "FULL_DAY") {
      return true;
    }

    if (booking.timeSlot === "FULL_DAY") {
      return true;
    }

    return booking.timeSlot === timeSlot;
  });

  if (hasConflict) {
    return error("Desk already booked for this time slot");
  }

  await prisma.booking.create({
    data: {
      userId: user.id,
      deskId,
      date: bookingDate,
      timeSlot,
      notes,
      status: "CONFIRMED",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/bookings");
  revalidatePath("/admin");

  return {
    success: true as const,
    message: "Desk booked successfully",
  };
}

export async function cancelBookingAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const bookingId = formData.get("bookingId");

  if (typeof bookingId !== "string") {
    throw new Error("Booking id is required");
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  const isOwner = booking.userId === user.id;
  const isAdmin = currentUser?.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new Error("Unauthorized");
  }

  await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/bookings");
  revalidatePath("/admin");

}