"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createDeskSchema,
  updateDeskStatusSchema,
  updateDeskDayStatusSchema,
} from "@/lib/validations";

async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return user;
}

export async function createDeskAction(formData: FormData) {
  await requireAdmin();

  const parsed = createDeskSchema.safeParse({
    identifier: formData.get("identifier"),
    department: formData.get("department"),
    location: formData.get("location"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid desk data");
  }

  const existingDesk = await prisma.desk.findUnique({
    where: {
      identifier: parsed.data.identifier,
    },
  });

  if (existingDesk) {
    throw new Error("A desk with this identifier already exists");
  }

  await prisma.desk.create({
    data: {
      identifier: parsed.data.identifier,
      department: parsed.data.department,
      location: parsed.data.location,
      status: "AVAILABLE",
      features: ["monitor", "keyboard", "mouse"],
    },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

export async function updateDeskStatusAction(formData: FormData) {
  await requireAdmin();

  const parsed = updateDeskStatusSchema.safeParse({
    deskId: formData.get("deskId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid desk status");
  }

  await prisma.desk.update({
    where: {
      id: parsed.data.deskId,
    },
    data: {
      status: parsed.data.status,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

export async function deleteDeskAction(formData: FormData) {
  await requireAdmin();

  const deskId = String(formData.get("deskId"));

  if (!deskId) {
    throw new Error("Desk id is required");
  }

  await prisma.desk.delete({
    where: {
      id: deskId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

export async function updateDeskDayStatusAction(formData: FormData) {
  await requireAdmin();

  const parsed = updateDeskDayStatusSchema.safeParse({
    deskId: formData.get("deskId"),
    date: formData.get("date"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message || "Invalid desk day status"
    );
  }

  const statusDate = new Date(`${parsed.data.date}T00:00:00.000Z`);

  await prisma.deskDayStatus.upsert({
    where: {
      deskId_date: {
        deskId: parsed.data.deskId,
        date: statusDate,
      },
    },
    update: {
      status: parsed.data.status,
    },
    create: {
      deskId: parsed.data.deskId,
      date: statusDate,
      status: parsed.data.status,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/bookings");
}

export async function updateDeskDepartmentAction(
  formData: FormData
) {
  await requireAdmin();

  const deskId = String(formData.get("deskId"));
  const department = String(formData.get("department"));

  if (!deskId) {
    throw new Error("Desk id is required");
  }

  await prisma.desk.update({
    where: {
      id: deskId,
    },
    data: {
      department,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
}