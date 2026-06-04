"use client";

type ToastProps = {
  message: string;
  type: "success" | "error";
};

export function Toast({ message, type }: ToastProps) {
  return (
    <div
      className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 shadow-lg text-white ${
        type === "success"
          ? "bg-green-600"
          : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
}