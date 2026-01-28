// Calendar Integration for Hekmo
// Supports Google Calendar and Apple Calendar

const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";

interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone?: string };
  end: { dateTime: string; timeZone?: string };
  location?: string;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{ method: string; minutes: number }>;
  };
}

// Get Google Calendar access token from user
async function getGoogleAccessToken(userId: string): Promise<string | null> {
  // In production, fetch from database based on user's OAuth tokens
  // This is a placeholder
  return process.env.GOOGLE_CALENDAR_ACCESS_TOKEN || null;
}

// List calendar events
export async function listCalendarEvents(
  userId: string,
  options: {
    timeMin?: Date;
    timeMax?: Date;
    maxResults?: number;
  } = {}
): Promise<CalendarEvent[]> {
  const accessToken = await getGoogleAccessToken(userId);
  if (!accessToken) {
    throw new Error("Calendar not connected");
  }

  const params = new URLSearchParams({
    maxResults: String(options.maxResults || 10),
    orderBy: "startTime",
    singleEvents: "true",
    timeMin: (options.timeMin || new Date()).toISOString(),
  });

  if (options.timeMax) {
    params.set("timeMax", options.timeMax.toISOString());
  }

  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events?${params}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const data = await response.json();
  return data.items || [];
}

// Create calendar event
export async function createCalendarEvent(
  userId: string,
  event: CalendarEvent
): Promise<CalendarEvent> {
  const accessToken = await getGoogleAccessToken(userId);
  if (!accessToken) {
    throw new Error("Calendar not connected");
  }

  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create event");
  }

  return response.json();
}

// Update calendar event
export async function updateCalendarEvent(
  userId: string,
  eventId: string,
  updates: Partial<CalendarEvent>
): Promise<CalendarEvent> {
  const accessToken = await getGoogleAccessToken(userId);
  if (!accessToken) {
    throw new Error("Calendar not connected");
  }

  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events/${eventId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update event");
  }

  return response.json();
}

// Delete calendar event
export async function deleteCalendarEvent(
  userId: string,
  eventId: string
): Promise<void> {
  const accessToken = await getGoogleAccessToken(userId);
  if (!accessToken) {
    throw new Error("Calendar not connected");
  }

  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events/${eventId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok && response.status !== 204) {
    throw new Error("Failed to delete event");
  }
}

// Generate iCal format for Apple Calendar
export function generateICalEvent(event: CalendarEvent): string {
  const formatDate = (date: string) => {
    return new Date(date)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  };

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hekmo//Calendar//AR",
    "BEGIN:VEVENT",
    `UID:${event.id || crypto.randomUUID()}@hekmo.ai`,
    `DTSTAMP:${formatDate(new Date().toISOString())}`,
    `DTSTART:${formatDate(event.start.dateTime)}`,
    `DTEND:${formatDate(event.end.dateTime)}`,
    `SUMMARY:${event.summary}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${event.location}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR");

  return lines.join("\r\n");
}

// Create health reminder event
export function createHealthReminder(
  title: string,
  reminderTime: Date,
  durationMinutes = 30
): CalendarEvent {
  const end = new Date(reminderTime.getTime() + durationMinutes * 60000);

  return {
    summary: `🏥 ${title}`,
    description: "تذكير صحي من حكمو",
    start: {
      dateTime: reminderTime.toISOString(),
      timeZone: "Asia/Riyadh",
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: "Asia/Riyadh",
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: 30 },
        { method: "popup", minutes: 10 },
      ],
    },
  };
}
