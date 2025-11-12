import nodemailer from 'nodemailer';

function assertEnv(varName) {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
  return value;
}

export function getTransport() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || (host === 'smtp.gmail.com' ? 465 : 587));
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === 'true'
    : port === 465;

  const user = assertEnv('SMTP_USER');
  const pass = assertEnv('SMTP_PASS');

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
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
