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

function redirectWithError(date: string, message: string): never {
  redirect(`/dashboard?date=${date}&error=${encodeURIComponent(message)}`);
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
    redirectWithError(
      String(formData.get("date") || ""),
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
    redirectWithError(date, "Desk not found");
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
    redirectWithError(date, "This desk is not available on this date");
  }

  const existingBookings: ExistingBooking[] = await prisma.booking.findMany({
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
    redirectWithError(date, "Desk already booked for this time slot");
  }

  const cancelledBookingWithSameSlot = existingBookings.find(
    (booking) =>
      booking.timeSlot === timeSlot && booking.status === "CANCELLED"
  );

  if (cancelledBookingWithSameSlot) {
    await prisma.booking.update({
      where: {
        id: cancelledBookingWithSameSlot.id,
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
  revalidatePath("/bookings");
  revalidatePath("/admin");

  redirect(`/dashboard?date=${date}`);
}

export async function cancelBookingAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const bookingId = String(formData.get("bookingId"));

  if (!bookingId) {
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