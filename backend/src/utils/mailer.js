import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export const sendVerificationEmail = async (to, token) => {
  const verifyUrl = `${process.env.API_BASE_URL}/api/auth/verify?token=${token}`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Potvrdenie e-mailu – E-Wash',
    html: `
      <h2>Vitajte v E-Wash 🚗💦</h2>
      <p>Pre potvrdenie registrácie kliknite na tlačidlo nižšie:</p>
      <a href="${verifyUrl}"
         style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
        Potvrdiť e-mail
      </a>
    `
  })
}
