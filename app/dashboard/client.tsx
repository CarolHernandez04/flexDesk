"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { Button } from "@/components/button";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Calendar, Plus, Trash2, AlertCircle } from "lucide-react";
import { formatDate, TIME_SLOTS, BOOKING_STATUSES } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Desk {
  id: string;
  identifier: string;
  status: string;
  department?: string;
  location?: string;
  features?: string[];
  bookings: Array<{
    id: string;
    timeSlot: string;
    status: string;
  }>;
}

interface Booking {
  id: string;
  deskId: string;
  date: string;
  timeSlot: string;
  status: string;
  desk: {
    identifier: string;
    department?: string;
  };
}

export default function DashboardClient() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const [desks, setDesks] = useState<Desk[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDesk, setSelectedDesk] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("MORNING");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Fetch desks
  useEffect(() => {
    const fetchDesks = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedDate) params.append("date", selectedDate);
        if (selectedDepartment) params.append("department", selectedDepartment);

        const response = await fetch(`/api/desks?${params}`);
        if (!response.ok) throw new Error("Failed to fetch desks");

        const data = await response.json();
        setDesks(data);
      } catch{
        setError("Failed to load desks");
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/bookings");
        if (!response.ok) throw new Error("Failed to fetch bookings");

        const data = await response.json();
        setBookings(data);
      } catch{
        setError("Failed to load bookings");
      }
    };

    Promise.all([fetchDesks(), fetchBookings()]).finally(() => setLoading(false));
  }, [selectedDate, selectedDepartment]);

  const handleBookDesk = async () => {
    if (!selectedDesk) {
      setError("Please select a desk");
      return;
    }

    try {
      setError("");
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deskId: selectedDesk,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to book desk");
        return;
      }

      setSuccess("Desk booked successfully!");
      setShowBookingForm(false);
      setSelectedDesk(null);

      // Refresh bookings and desks
      const bookingsRes = await fetch("/api/bookings");
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData);

      const desksRes = await fetch(
        `/api/desks?date=${selectedDate}${
          selectedDepartment ? `&department=${selectedDepartment}` : ""
        }`
      );
      const desksData = await desksRes.json();
      setDesks(desksData);

      setTimeout(() => setSuccess(""), 3000);
    } catch{
      setError("Failed to book desk");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to cancel booking");

      setSuccess("Booking cancelled successfully!");
      setBookings(bookings.filter((b) => b.id !== bookingId));

      setTimeout(() => setSuccess(""), 3000);
    } catch{
      setError("Failed to cancel booking");
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {session?.user?.name || session?.user?.email}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <Tabs defaultValue="book" className="space-y-4">
        <TabsList>
          <TabsTrigger value="book" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Book a Desk
          </TabsTrigger>
          <TabsTrigger value="mybookings">My Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department (Optional)
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Available Desks</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {desks.length > 0 ? (
                  desks.map((desk) => (
                    <div
                      key={desk.id}
                      className={`p-4 border rounded-lg cursor-pointer transition ${
                        selectedDesk === desk.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedDesk(desk.id)}
                    >
                      <h4 className="font-semibold text-gray-900">
                        {desk.identifier}
                      </h4>
                      {desk.department && (
                        <p className="text-sm text-gray-600">{desk.department}</p>
                      )}
                      {desk.location && (
                        <p className="text-sm text-gray-600">{desk.location}</p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {["MORNING", "AFTERNOON", "FULL_DAY"].map((slot) => {
                          const booked = desk.bookings.some(
                            (b) => b.timeSlot === slot && b.status !== "CANCELLED"
                          );
                          return (
                            <span
                              key={slot}
                              className={`text-xs px-2 py-1 rounded ${
                                booked
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {slot === "MORNING"
                                ? "AM"
                                : slot === "AFTERNOON"
                                ? "PM"
                                : "FD"}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 col-span-full">
                    No desks available for the selected date and filters
                  </p>
                )}
              </div>

              {selectedDesk && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Select Time Slot
                  </h4>
                  <div className="space-y-3 mb-4">
                    {["MORNING", "AFTERNOON", "FULL_DAY"].map((slot) => (
                      <label key={slot} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="timeSlot"
                          value={slot}
                          checked={selectedTimeSlot === slot}
                          onChange={(e) => setSelectedTimeSlot(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">
                          {TIME_SLOTS[slot as keyof typeof TIME_SLOTS]}
                        </span>
                      </label>
                    ))}
                  </div>
                  <Button
                    onClick={handleBookDesk}
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Book This Desk
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mybookings" className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Desk
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Time Slot
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings
                      .filter((b) => b.status !== "CANCELLED")
                      .map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {booking.desk.identifier}
                            {booking.desk.department && (
                              <p className="text-xs text-gray-600">
                                {booking.desk.department}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {formatDate(new Date(booking.date))}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {
                              TIME_SLOTS[
                              booking.timeSlot as keyof typeof TIME_SLOTS
                              ]
                            }
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                BOOKING_STATUSES[
                                booking.status as keyof typeof BOOKING_STATUSES
                                ].color
                              }`}
                            >
                              {
                                BOOKING_STATUSES[
                                booking.status as keyof typeof BOOKING_STATUSES
                                ].label
                              }
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-600">
                  {"You don't have any active bookings yet."}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
