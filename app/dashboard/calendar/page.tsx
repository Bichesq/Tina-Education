import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import { Suspense } from "react";

async function CalendarContent() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-500">Please log in to view your calendar.</p>
      </div>
    );
  }

  // Get user's manuscripts and reviews for calendar events
  const [manuscripts, reviews] = await Promise.all([
    prisma.manuscript.findMany({
      where: { author_id: session.user.id },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.review.findMany({
      where: { reviewer_id: session.user.id },
      include: {
        manuscript: {
          select: { title: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  // Generate calendar events from manuscripts and reviews
  const events = [
    ...manuscripts.map((manuscript) => ({
      id: `manuscript-${manuscript.id}`,
      title: `Manuscript: ${manuscript.title}`,
      date: manuscript.updatedAt,
      type: "manuscript",
      status: manuscript.status,
      description: `Last updated: ${manuscript.status}`,
    })),
    ...reviews.map((review) => ({
      id: `review-${review.id}`,
      title: `Review: ${review.manuscript.title}`,
      date: review.updatedAt,
      type: "review",
      status: review.status,
      description: `Review status: ${review.status}`,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get current date info
  const now = new Date();
  const currentMonth = now.toLocaleString("default", { month: "long", year: "numeric" });
  
  // Generate calendar grid (simplified)
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(now.getFullYear(), now.getMonth(), day);
    const dayEvents = events.filter(
      (event) =>
        new Date(event.date).toDateString() === date.toDateString()
    );
    calendarDays.push({ day, date, events: dayEvents });
  }

  function getEventColor(type: string, status: string) {
    if (type === "manuscript") {
      switch (status) {
        case "DRAFT":
          return "bg-gray-100 text-gray-800";
        case "SUBMITTED":
          return "bg-blue-100 text-blue-800";
        case "UNDER_REVIEW":
          return "bg-yellow-100 text-yellow-800";
        case "ACCEPTED":
          return "bg-green-100 text-green-800";
        case "REJECTED":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    } else {
      switch (status) {
        case "PENDING":
          return "bg-orange-100 text-orange-800";
        case "IN_REVIEW":
          return "bg-blue-100 text-blue-800";
        case "REVIEW_SUBMITTED":
          return "bg-green-100 text-green-800";
        case "DECLINED":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
  }

  const upcomingEvents = events.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{currentMonth}</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
            Today
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayData, index) => (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border border-gray-100 ${
                    dayData ? "bg-white hover:bg-gray-50" : "bg-gray-50"
                  }`}
                >
                  {dayData && (
                    <>
                      <div
                        className={`text-sm font-medium mb-1 ${
                          dayData.day === now.getDate() &&
                          dayData.date.getMonth() === now.getMonth()
                            ? "text-blue-900 font-bold"
                            : "text-gray-900"
                        }`}
                      >
                        {dayData.day}
                      </div>
                      <div className="space-y-1">
                        {dayData.events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded truncate ${getEventColor(
                              event.type,
                              event.status
                            )}`}
                            title={event.title}
                          >
                            {event.type === "manuscript" ? "📝" : "📋"}{" "}
                            {event.title.substring(0, 15)}...
                          </div>
                        ))}
                        {dayData.events.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayData.events.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-lg">
                      {event.type === "manuscript" ? "📝" : "📋"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${getEventColor(
                          event.type,
                          event.status
                        )}`}
                      >
                        {event.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              This Month
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Manuscripts Updated</span>
                <span className="text-sm font-medium text-gray-900">
                  {manuscripts.filter(
                    (m) =>
                      new Date(m.updatedAt).getMonth() === now.getMonth() &&
                      new Date(m.updatedAt).getFullYear() === now.getFullYear()
                  ).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Reviews Completed</span>
                <span className="text-sm font-medium text-gray-900">
                  {reviews.filter(
                    (r) =>
                      new Date(r.updatedAt).getMonth() === now.getMonth() &&
                      new Date(r.updatedAt).getFullYear() === now.getFullYear()
                  ).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Events</span>
                <span className="text-sm font-medium text-gray-900">
                  {events.filter(
                    (e) =>
                      new Date(e.date).getMonth() === now.getMonth() &&
                      new Date(e.date).getFullYear() === now.getFullYear()
                  ).length}
                </span>
              </div>
            </div>
          </div>

          {/* Calendar Legend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">📝</span>
                <span className="text-sm text-gray-600">Manuscripts</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">📋</span>
                <span className="text-sm text-gray-600">Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="flex space-x-2">
          <div className="h-10 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded w-16"></div>
          <div className="h-10 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-16 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <div className="p-8 min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
        <p className="text-gray-600">
          Track your manuscript deadlines and review schedules
        </p>
      </div>

      <Suspense fallback={<CalendarLoading />}>
        <CalendarContent />
      </Suspense>
    </div>
  );
}
