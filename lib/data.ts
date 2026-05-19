import { prisma } from "@/lib/prisma";

type DeskWithDayStatus = {
  id: string;
  identifier: string;
  status: string;
  department: string | null;
  location: string | null;
  features?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  dayStatuses: {
    status: string;
  }[];
  bookings?: {
    id: string;
    timeSlot: string;
    status: string;
  }[];
};

export async function getDesksForDate(date: string, department?: string) {
  const bookingDate = new Date(`${date}T00:00:00.000Z`);

  const desks: DeskWithDayStatus[] = await prisma.desk.findMany({
    where: {
      department: department || undefined,
    },
    include: {
      dayStatuses: {
        where: {
          date: bookingDate,
        },
        select: {
          status: true,
        },
      },
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

  return desks
    .map((desk: DeskWithDayStatus) => {
      const dayStatus = desk.dayStatuses[0]?.status || desk.status;

      return {
        ...desk,
        effectiveStatus: dayStatus,
      };
    })
    .filter((desk) => desk.effectiveStatus === "AVAILABLE");
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

export async function getAdminDashboardData(date?: string) {
  const selectedDate = date || new Date().toISOString().split("T")[0];
  const adminDate = new Date(`${selectedDate}T00:00:00.000Z`);

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
      include: {
        dayStatuses: {
          where: {
            date: adminDate,
          },
          select: {
            status: true,
          },
        },
      },
    }),

    prisma.booking.findMany({
      where: {
        date: adminDate,
      },
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

  const desksWithEffectiveStatus = desks.map((desk: DeskWithDayStatus) => ({
    ...desk,
    effectiveStatus: desk.dayStatuses[0]?.status || desk.status,
  }));

  return {
    users,
    desks: desksWithEffectiveStatus,
    bookings,
    selectedDate,
  };
}