import nodemailer from "nodemailer";

export const sendVerificationEmail = async (to: string, code: number) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,      
      pass: process.env.EMAIL_PASSWORD,  
    },
  });

  await transporter.sendMail({
    from: `"CZ Game" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify Your Email",
    html: `<p>Your verification code is <b>${code}</b>. It will expire in 1 hour.</p>`,
  });
};
