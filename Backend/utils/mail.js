import { text } from 'express'
import nodemailer from 'nodemailer'


const hostporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure:false,
    user: process.env.MAILTRAP_HOST
})

const mailOption =  {
    from: process.env.MAILTRAP_SENDERMAIL,
    from: user.email,
    subject: "Verify your email",
    text: `Please click on the following link : 
    ${http}`
}