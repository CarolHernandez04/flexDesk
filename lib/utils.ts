import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export const DESK_STATUSES = {
  AVAILABLE: { label: "Available", color: "bg-green-100 text-green-800" },
  OCCUPIED: { label: "Occupied", color: "bg-red-100 text-red-800" },
  MAINTENANCE: { label: "Maintenance", color: "bg-yellow-100 text-yellow-800" },
};

export const TIME_SLOTS = {
  MORNING: "Morning (9:00 AM - 1:00 PM)",
  AFTERNOON: "Afternoon (1:00 PM - 5:00 PM)",
  FULL_DAY: "Full Day (9:00 AM - 5:00 PM)",
};

export const BOOKING_STATUSES = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Confirmed", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};
