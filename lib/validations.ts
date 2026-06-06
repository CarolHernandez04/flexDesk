import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must contain at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must contain at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const bookingSchema = z.object({
  deskId: z.string().min(1, "Desk is required"),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.enum(["MORNING", "AFTERNOON", "FULL_DAY"]),
  notes: z.string().optional(),
});

export const createDeskSchema = z.object({
  identifier: z.string().min(2, "Desk identifier is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
});

export const updateDeskDayStatusSchema = z.object({
  deskId: z.string().min(1, "Desk is required"),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type CreateDeskInput = z.infer<typeof createDeskSchema>;
export type UpdateDeskDayStatusInput = z.infer<typeof updateDeskDayStatusSchema>;