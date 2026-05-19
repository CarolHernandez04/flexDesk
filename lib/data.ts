import { prisma } from "@/lib/prisma";

export async function getDesksForDate(date: string, department?: string) {
  const bookingDate = new Date(`${date}T00:00:00.000Z`);

  return prisma.desk.findMany({
    where: {
      department: department || undefined,
    },
    include: {
      bookings: {
        where: {
          date: bookingDate,
          status: {
            not: "CANCELLED",
          },
        },
        select: {
          id: true,
          timeSlot: true,
          status: true,
        },
      },
    },
    orderBy: {
      identifier: "asc",
    },
  });
}

export async function getUserBookings(userId: string) {
  return prisma.booking.findMany({
    where: {
      userId,
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
}

export async function getAdminDashboardData() {
  const [users, desks, bookings] = await Promise.all([
    prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        createdAt: true,
      },
    }),

    prisma.desk.findMany({
      orderBy: {
        identifier: "asc",
      },
      select: {
        id: true,
        identifier: true,
        status: true,
        department: true,
        location: true,
      },
    }),

    prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        desk: {
          select: {
            identifier: true,
            department: true,
          },
        },
      },
    }),
  ]);

  return {
    users,
    desks,
    bookings,
  };
}