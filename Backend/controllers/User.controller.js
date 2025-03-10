import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.model.js'
import { sendMail } from '../utils/mail.js'

const registerUser = async (req, res, next) => {
    // get data from req.body
    // validate 
    // check for if user already exists
    // if not exists create user in db
    // generate verification token
    // save token in db
    // send token as email to user // services - nodemaller, mailtrap, 
    // send sucess status to user

    try {

        const { name, email, password } = req.body;
        if ((!name || !email || !password)) {
            return res.status(400).json({
                message: "All feilds are required",
            })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const newUser = await User.create({
            name, email, password
        })

        if (!newUser) {
            return res.status(400).json({
                message: "User not created"
            })
        }
        const token = crypto.randomBytes(32).toString("hex")
        newUser.varificationToken = token;
        await newUser.save();

        const subjectForMail = "This is for varification "
        const text = `Welcome ${user.email}
            Thank you for signing up for Mailtrap.
            Verify your email address by clicking below.
            ${process.env.BASE_URL}/api/v1/user/verify/${token}

`
        sendMail({ userEmail: user.email, userSubject: subjectForMail, userText: text });

        res.status(201).json({
            message: "User created sucessfully",
            sucess: true,
            newUser
        })

    } catch (error) {
        res.status(400).json({
            message: "Unable to create User",
            error,
            sucess: false,
        })
    }


}

const verifyToken = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        res.status(400).json({
            message: "Something went wrong Please SignUp again",
        })
    }
    const user = await User.findOne({ varificationToken: token });
    if (!user) {
        res.status(400).json({
            message: "Something went wrong Please SignUp again",
        })
    }

    if (token == user.varificationToken) {
        user.isVerified = true;
        user.varificationToken = null
    }

    await user.save()

}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid user or password"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid user or password"
            })
        }

        const token = jwt.sign({ id: user._id, role: user.role },
            "sdfdfik",
            {
                expiresIn: "24h"
            }
        )

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 15 * 24 * 60 * 60 * 1000,
        }
        res.cookie("test", token, { cookieOptions })

        res.status(200).json({
            sucess: true,
            message: "Login sucessful",
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
            }
        })
    } catch (error) {
        res.status(400).json({
            sucess: false,
            message: "Login unsucessfull",
            error
        })
    }
}

const resetPassword = async (req, res) => {

    const { email } = req.body
    if (!email) {
        res.status(401).json({
            message: "Please Enter Email"
        })
    }
    const user = User.findOne({ email })
    if (!user) {
        res.status(400).json({
            message: "User not found Please Sign Up",
        })
    }

    const token = crypto.randomBytes(32).toString("hex")

    if (!token) {
        res.status(400).json({
            message: "Something went wrong while generating token",
        })
    }

    user.passwordResetToken = token
    user.resetPasswordExpires = '10m'
    const subjectForMail = "This is for varification "
    const text = `Welcome ${user.email}
        Reset your password by clicking below.
        ${process.env.BASE_URL}/api/v1/user/verify/${token}`

    sendMail({ userEmail: user.email, userSubject: subjectForMail, userText: text })

    await user.save()
}

const changePassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password } = req.body

        if (!token) {
            res.status(401).json({
                message: "Link is Expired Please send again"
            })
        }
        if (!password) {
            res.status(401).json({
                message: "Please Enter New password"
            })
        }

        const user = User.findOne({ passwordResetToken: token })

        if (!user) {
            res.status(401).json({
                message: "User Not Exists"
            })
        }

        const userToken = await user.passwordResetToken
        if (token == userToken) {
            user.password = password
            user.passwordResetToken = null
            user.resetPasswordExpires = '0'
        }

        await user.save()

        res.status(200).json({
            message: "Password Changed Sucessfully"
        })

    } catch (err) {
        res.status(401).json({
            message: "Unable to change Password",
            err
        })
    }
}


export { login, registerUser, verifyToken, resetPassword, changePassword }
