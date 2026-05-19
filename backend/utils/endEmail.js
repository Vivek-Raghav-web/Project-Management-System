import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vivekraghav2006@gmail.com",
      pass: "oqjr miuq kugs tpej"
    }
  });

  await transporter.sendMail({
    from: "vivekraghav2006@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`
  });
};

export default sendEmail;