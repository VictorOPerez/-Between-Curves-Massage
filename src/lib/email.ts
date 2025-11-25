import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === 'true', // true para 465, false para 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Nombre que verá el cliente en el correo
const FROM_NAME = 'Between Curves Massage';
// Dirección real desde la que se envía (tu cuenta de Gmail workspace)
const FROM_EMAIL = process.env.SMTP_USER || '';
// Correo donde tu clienta recibe las notificaciones
const OWNER_EMAIL = process.env.BUSINESS_OWNER_EMAIL || FROM_EMAIL;

if (!FROM_EMAIL) {
  console.warn(
    '[email] Falta SMTP_USER en el .env, los correos no podrán enviarse correctamente.'
  );
}

export async function sendConfirmationEmail(
  to: string,
  clientName: string,
  date: string,
  time: string,
  serviceName: string
) {

  // --- AGREGA ESTOS LOGS PARA VER QUÉ PASA ---
  console.log("--- INTENTANDO ENVIAR CORREOS ---");
  console.log("1. Email Cliente:", to);
  console.log("2. Email Dueña:", OWNER_EMAIL);


  const htmlContent = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; color: #25413A; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #25413A; padding: 20px; text-align: center;">
        <h1 style="color: #D4B886; margin: 0;">Confirmación de reserva</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e5e7eb; background-color:#ffffff;">
        <p>Hola <strong>${clientName}</strong>,</p>
        <p>Tu cita ha sido reservada con éxito. ¡Gracias por confiar en Between Curves Massage!</p>
        
        <div style="background-color: #f0fdfa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Servicio:</strong> ${serviceName}</p>
          <p style="margin: 5px 0;"><strong>Fecha:</strong> ${date}</p>
          <p style="margin: 5px 0;"><strong>Hora:</strong> ${time}</p>
        </div>

        <p style="font-size: 13px; color: #64748b;">
          Si necesitas cambiar o cancelar tu cita, responde directamente a este correo.
        </p>
      </div>
    </div>
  `;

  try {
    // 1) Correo al CLIENTE
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,                     // email del cliente que reservó
      replyTo: OWNER_EMAIL,   // si responde, le llega a tu clienta / dueña
      subject: `Tu reserva está confirmada – ${serviceName}`,
      html: htmlContent,
    });

    // 2) Correo de NOTIFICACIÓN a la DUEÑA
    await transporter.sendMail({
      from: `"Sistema de Reservas" <${FROM_EMAIL}>`,
      to: OWNER_EMAIL, // aquí recibe tu clienta
      subject: `🔔 Nueva cita reservada: ${clientName}`,
      text: `Nueva reserva para "${serviceName}" el ${date} a las ${time}.\nCliente: ${clientName} (${to}).`,
    });

    return true;
  } catch (error) {
    console.error('Error enviando email:', error);
    return false;
  }
}
