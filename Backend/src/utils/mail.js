import nodemailer from 'nodemailer'

const sendMail = async (userEmail, userSubject, userText) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: true,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILAUTH_PASS,
        },
    })

    await transporter.sendMail({
        from: process.env.MAILTRAP_SENDERMAIL,
        from: userEmail,
        subject: userSubject,
        text: userText
    })

}

export { sendMail }