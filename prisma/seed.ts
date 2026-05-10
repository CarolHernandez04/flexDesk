import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.roomBooking.deleteMany();
  await prisma.desk.deleteMany();
  await prisma.meetingRoom.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users
  const adminPassword = await hash("admin123", 10);
  const userPassword = await hash("user123", 10);

  await prisma.user.create({
    data: {
      email: "admin@flexdesk.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
      department: "Management",
    },
  });

  await prisma.user.create({
    data: {
      email: "john@flexdesk.com",
      password: userPassword,
      name: "John Doe",
      role: "EMPLOYEE",
      department: "Engineering",
    },
  });

  await prisma.user.create({
    data: {
      email: "jane@flexdesk.com",
      password: userPassword,
      name: "Jane Smith",
      role: "EMPLOYEE",
      department: "Sales",
    },
  });

  // Create desks
  const deskIds: string[] = [];
  const departments = ["Engineering", "Sales", "Marketing", "HR"];
  const floors = [1, 2, 3];

  for (let floor = 0; floor < floors.length; floor++) {
    for (let i = 0; i < 12; i++) {
      const dept = departments[floor % departments.length];

      const desk = await prisma.desk.create({
        data: {
          identifier: `DESK-${String.fromCharCode(65 + floor)}${String(i + 1).padStart(2, "0")}`,
          status: "AVAILABLE",
          department: dept,
          location: `Floor ${floor + 1}, Zone ${String.fromCharCode(65 + (i % 3))}`,
          features: ["monitor", "keyboard", "mouse"],
        },
      });

      deskIds.push(desk.id);
    }
  }

  // Create meeting rooms
  const meetingRooms = [
    "Conference Room A",
    "Conference Room B",
    "Board Room",
    "Focus Room",
  ];

  for (const roomName of meetingRooms) {
    await prisma.meetingRoom.create({
      data: {
        name: roomName,
        capacity: roomName.includes("Board")
          ? 20
          : roomName.includes("Focus")
            ? 4
            : 10,
        floor: Math.floor(Math.random() * 3) + 1,
        location: `Floor ${Math.floor(Math.random() * 3) + 1}`,
        features: ["projector", "whiteboard", "video_conference"],
        status: "AVAILABLE",
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`✅ Created ${deskIds.length} desks`);
  console.log(`✅ Created ${meetingRooms.length} meeting rooms`);
  console.log("\n🔐 Demo Credentials:");
  console.log("Admin - email: admin@flexdesk.com / password: admin123");
  console.log("Employee 1 - email: john@flexdesk.com / password: user123");
  console.log("Employee 2 - email: jane@flexdesk.com / password: user123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });