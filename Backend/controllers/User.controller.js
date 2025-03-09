import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.model.js'

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

const verifyToken = async(req, res) => {
    
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


export { login, registerUser }
