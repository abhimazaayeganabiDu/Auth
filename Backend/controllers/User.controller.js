import User from '../models/User.model.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

const registerUser = async(req, res) => {
    // get data from req.body
    // validate 
    // check for if user already exists
    // if not exists create user in db
    // generate verification token
    // save token in db
    // send token as email to user // services - nodemaller, mailtrap, 
    // send sucess status to user

    const {name, email, password} = req.body;
    
    console.log(name);
    if(!name || !email || !password) {
        return res.status(400).json({
            message: "All feilds are required",
        })
    }

    try {
        const user = await User.findOne({email})
        if(user) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const createdUser = await User.create({
            name, 
            email,
            password,
        })
        
        if(!createdUser) {
            return res.status(400).json({
                message: "User not registered"
            })
        }
        
        const token = crypto.randomBytes(32).toString("hex")

        console.log(createdUser);
        console.log(token);
        
        createdUser.varificationToken = token;
        console.log("check", createdUser.varificationToken);
        console.log("check");
        await createdUser.save()

        console.log("check");
        

        // send email

        // const hostporter = nodemailer.createTransport({
        //     host: process.env.MAILTRAP_HOST,
        //     port: process.env.MAILTRAP_PORT,
        //     secure:false,
        //     user: process.env.MAILTRAP_HOST
        // })
        
        // const mailOption =  {
        //     from: process.env.MAILTRAP_SENDERMAIL,
        //     from: user.email,
        //     subject: "Verify your email",
        //     text: `Please click on the following link : 
        //     ${process.env.BASE_URL}/api/v1/user/verify/${token}`
        // }

        // await transporter.sendMail(mailOption);


        res.status(201).json({
            message: "User created sucessfully",
            sucess:true
        })

    } catch (error) {
        res.status(400).json({
            message: "User not create",
            error, 
            sucess: false
        })
    }


}


// const verifyToken = async(req, res) => {

// }

export {registerUser}