import { sendEmail } from '@/lib/gmail';

// ----------------------------------------------------------------------
// 1. LAS PLANTILLAS HTML (Separadas para que no estorben)
// ----------------------------------------------------------------------

const getClientEmailTemplate = (name: string, date: string, time: string, service: string) => `
<div style="font-family: system-ui, -apple-system, sans-serif; color: #25413A; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #25413A; padding: 20px; text-align: center;">
    <h1 style="color: #D4B886; margin: 0;">Confirmación de reserva</h1>
  </div>
  <div style="padding: 20px; border: 1px solid #e5e7eb; background-color:#ffffff;">
    <p>Hola <strong>${name}</strong>,</p>
    <p>Tu cita ha sido reservada con éxito. ¡Gracias por confiar en Between Curves Massage!</p>
    
    <div style="background-color: #f0fdfa; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Servicio:</strong> ${service}</p>
      <p style="margin: 5px 0;"><strong>Fecha:</strong> ${date}</p>
      <p style="margin: 5px 0;"><strong>Hora:</strong> ${time}</p>
      <p style="margin: 5px 0;"><strong>Lugar:</strong> 801 E Semoran Blvd</p>
    </div>

    <p style="font-size: 13px; color: #64748b;">
      Si necesitas cambiar o cancelar tu cita, responde directamente a este correo.
    </p>
  </div>
</div>
`;

const getAdminEmailTemplate = (clientName: string, clientEmail: string, date: string, time: string, service: string, amount: number) => `
<div style="font-family: sans-serif;">
    <h2 style="color: #25413A;">🔔 Nueva Cita Confirmada (Pagada)</h2>
    <ul>
        <li><strong>Cliente:</strong> ${clientName} (${clientEmail})</li>
        <li><strong>Servicio:</strong> ${service}</li>
        <li><strong>Fecha:</strong> ${date} a las ${time}</li>
        <li><strong>Pago Recibido:</strong> $${amount.toFixed(2)}</li>
    </ul>
</div>
`;

// ----------------------------------------------------------------------
// 2. LA FUNCIÓN ORQUESTADORA (La que llamarás desde el Webhook)
// ----------------------------------------------------------------------

export async function sendBookingNotifications(
    clientEmail: string,
    clientName: string,
    date: string,
    time: string,
    serviceName: string,
    amountPaid: number
) {
    // Definimos el email del dueño (puedes usar el mismo impersonate user o uno específico)
    const OWNER_EMAIL = process.env.GOOGLE_IMPERSONATE_USER || 'admin@curvesmassages.com';

    // 1. Generar HTMLs usando las plantillas
    const htmlClient = getClientEmailTemplate(clientName, date, time, serviceName);
    const htmlAdmin = getAdminEmailTemplate(clientName, clientEmail, date, time, serviceName, amountPaid);

    console.log("📧 Iniciando envío de notificaciones...");

    try {
        // 2. Enviamos ambos correos en paralelo usando tu motor 'sendEmail'
        await Promise.all([
            // Correo al Cliente
            sendEmail(
                clientEmail,
                `Tu reserva está confirmada – ${serviceName}`,
                htmlClient
            ),
            // Correo al Dueño
            sendEmail(
                OWNER_EMAIL,
                `🔔 Nueva cita: ${clientName}`,
                htmlAdmin
            )
        ]);

        console.log("✅ Correos de notificación enviados (Cliente + Admin)");
        return true;

    } catch (error) {
        console.error("❌ Error en el orquestador de emails:", error);
        return false;
    }
}