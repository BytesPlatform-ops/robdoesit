import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation";

/* ============================================================
   BOOKING ENDPOINT
   ------------------------------------------------------------
   Delivery destination is configured with ONE env var:

     BOOKING_WEBHOOK_URL=https://...

   Point it at whatever Rob actually uses — a Zapier/Make hook,
   a Formspree endpoint, a Slack webhook, an email service.
   Until it is set, submissions are validated and logged on the
   server so nothing is silently lost, and the server log says so.
   ============================================================ */

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Some details are missing.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  // honeypot: a bot filled the hidden field — accept quietly, deliver nothing
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const booking = { ...parsed.data };
  delete (booking as { website?: string }).website;
  const enquiry = { ...booking, receivedAt: new Date().toISOString() };

  const destination = process.env.BOOKING_WEBHOOK_URL;

  if (!destination) {
    console.warn(
      "[ROB DOES IT] BOOKING_WEBHOOK_URL is not set — booking logged only, not delivered:",
      JSON.stringify(enquiry),
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch(destination, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enquiry),
    });
    if (!res.ok) throw new Error(`Destination responded ${res.status}`);
  } catch (error) {
    console.error("[ROB DOES IT] Booking delivery failed:", error, JSON.stringify(enquiry));
    return NextResponse.json(
      { ok: false, error: "Could not send right now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, delivered: true });
}
