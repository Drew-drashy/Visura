import nodemailer from 'nodemailer';

export function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    } : undefined
  });
}

export async function sendPasswordResetEmail(to, link) {
  const transporter = getTransport();
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@example.com',
    to,
    subject: 'Reset your password',
    html: `
      <p>We received a request to reset your password.</p>
      <p><a href="${link}">Click here to reset</a> (expires in 1 hour)</p>
      <p>If you didn’t request this, you can ignore this email.</p>
    `
  });
  return info;
}
