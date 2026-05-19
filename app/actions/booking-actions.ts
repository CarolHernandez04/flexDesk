"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";

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
    throw new Error(parsed.error.issues[0]?.message || "Invalid booking data");
  }

  const { deskId, date, timeSlot, notes } = parsed.data;
  const bookingDate = new Date(`${date}T00:00:00.000Z`);

  const desk = await prisma.desk.findUnique({
    where: {
      id: deskId,
    },
  });

  if (!desk) {
    throw new Error("Desk not found");
  }

  const existingBooking = await prisma.booking.findUnique({
    where: {
      deskId_date_timeSlot: {
        deskId,
        date: bookingDate,
        timeSlot,
      },
    },
  });

  if (existingBooking && existingBooking.status !== "CANCELLED") {
    throw new Error("Desk already booked for this time slot");
  }

  if (existingBooking) {
    await prisma.booking.update({
      where: {
        id: existingBooking.id,
      },
      data: {
        userId: user.id,
        status: "CONFIRMED",
        cancelledAt: null,
        notes,
      },
    });
  } else {
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
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin");
}

export async function cancelBookingAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const bookingId = String(formData.get("bookingId"));

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
  revalidatePath("/admin");
}