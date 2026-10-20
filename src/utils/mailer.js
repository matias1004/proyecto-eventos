import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendTicketConfirmation = async (to, ticket, event) => {
  if (!process.env.MAIL_HOST || !process.env.MAIL_USER) {
    console.warn("⚠️  Nodemailer no está configurado. Se omite el envío de mail.");
    return;
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to,
    subject: `Inscripción confirmada: ${event.title}`,
    text: `Tu inscripción fue confirmada.\n\nEvento: ${event.title}\nFecha: ${event.date}\nLugar: ${event.location}\nCódigo de reserva: ${ticket.reservationCode}`,
  });
};