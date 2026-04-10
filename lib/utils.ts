import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export const DESK_STATUSES = {
  AVAILABLE: { label: "Disponible", color: "bg-green-100 text-green-800" },
  OCCUPIED: { label: "Ocupado", color: "bg-red-100 text-red-800" },
  MAINTENANCE: { label: "Mantenimiento", color: "bg-yellow-100 text-yellow-800" },
};

export const TIME_SLOTS = {
  MORNING: "Mañana (9:00 AM - 1:00 PM)",
  AFTERNOON: "Tarde (1:00 PM - 5:00 PM)",
  FULL_DAY: "Día Completo (9:00 AM - 5:00 PM)",
};

export const BOOKING_STATUSES = {
  PENDING: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Confirmado", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-800" },
};
