// src/lib/notifications.ts
import "server-only";
import { sendEmail } from "@/lib/gmail";

// ----------------------------------------------------------------------
// 1) HTML templates
// ----------------------------------------------------------------------

const getClientEmailTemplate = (name: string, date: string, time: string, service: string) => `
<div style="font-family: system-ui, -apple-system, sans-serif; color: #25413A; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #25413A; padding: 20px; text-align: center;">
    <h1 style="color: #D4B886; margin: 0;">Booking confirmation</h1>
  </div>
  <div style="padding: 20px; border: 1px solid #e5e7eb; background-color:#ffffff;">
    <p>Hi <strong>${name}</strong>,</p>
    <p>Your appointment has been successfully booked. Thank you for trusting Between Curves Massage!</p>

    <div style="background-color: #f0fdfa; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Service:</strong> ${service}</p>
      <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
      <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
      <p style="margin: 5px 0;"><strong>Location:</strong> 801 E Semoran Blvd</p>
    </div>

    <p style="font-size: 13px; color: #64748b;">
      If you need to change or cancel your appointment, just reply to this email.
    </p>
  </div>
</div>
`;

const getAdminEmailTemplate = (
  clientName: string,
  clientEmail: string,
  date: string,
  time: string,
  service: string,
  amount: number
) => `
<div style="font-family: system-ui, -apple-system, sans-serif;">
  <h2 style="color: #25413A;">🔔 New Paid Booking Confirmed</h2>
  <ul>
    <li><strong>Client:</strong> ${clientName} (${clientEmail})</li>
    <li><strong>Service:</strong> ${service}</li>
    <li><strong>Date:</strong> ${date} at ${time}</li>
    <li><strong>Payment received:</strong> $${amount.toFixed(2)}</li>
  </ul>
</div>
`;

// ----------------------------------------------------------------------
// 2) Orchestrator function (called from the Stripe webhook)
// ----------------------------------------------------------------------

export async function sendBookingNotifications(
  clientEmail: string,
  clientName: string,
  date: string,
  time: string,
  serviceName: string,
  amountPaid: number
) {
  const OWNER_EMAIL = process.env.GOOGLE_IMPERSONATE_USER || "admin@curvesmassages.com";

  const htmlClient = getClientEmailTemplate(clientName, date, time, serviceName);
  const htmlAdmin = getAdminEmailTemplate(clientName, clientEmail, date, time, serviceName, amountPaid);

  console.log("📧 Starting booking notification emails...");

  try {
    const [clientOk, ownerOk] = await Promise.all([
      sendEmail(clientEmail, `Your booking is confirmed – ${serviceName}`, htmlClient),
      sendEmail(OWNER_EMAIL, `🔔 New booking: ${clientName}`, htmlAdmin),
    ]);

    if (!clientOk || !ownerOk) {
      console.warn("⚠️ One or more emails failed to send (check logs above).");
      return false;
    }

    console.log("✅ Notification emails sent (Client + Admin).");
    return true;
  } catch (error) {
    console.error("❌ Error in notifications orchestrator:", error);
    return false;
  }
}
