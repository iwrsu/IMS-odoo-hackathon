import 'server-only';

import nodemailer from 'nodemailer';
import { UserRole } from '@/lib/types';

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT ?? 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM;

function getTransporter() {
  if (!host || !user || !pass || !from) {
    throw new Error('SMTP env is incomplete. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOtpEmail(params: {
  to: string;
  name: string;
  otp: string;
  ttlMinutes: number;
  role: UserRole;
}) {
  const transporter = getTransporter();

  const subject = 'Your StockFlow OTP Code';
  const text = `Hi ${params.name},\n\nYour OTP is ${params.otp}. It expires in ${params.ttlMinutes} minutes.\nRole: ${params.role}.\n\nIf you did not request this code, ignore this email.`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.5; color:#111;">
      <h2>StockFlow OTP Verification</h2>
      <p>Hi ${params.name},</p>
      <p>Use the code below to sign in as <strong>${params.role}</strong>:</p>
      <p style="font-size:28px; letter-spacing:6px; font-weight:700; margin:16px 0;">${params.otp}</p>
      <p>This code expires in <strong>${params.ttlMinutes} minutes</strong>.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to: params.to,
      subject,
      text,
      html,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'SMTP delivery failed';
    if (message.includes('535') || message.toLowerCase().includes('authentication failed')) {
      throw new Error(
        'SMTP authentication failed (535). Use Brevo SMTP login and SMTP key in SMTP_USER/SMTP_PASS, and a verified sender in SMTP_FROM.'
      );
    }
    throw error;
  }
}
