import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config()

const URI = process.env.MONGO_URI

const db = async () => {

    try {
        const instance = await mongoose.connect(URI)
        console.log(`MongoDB connected sucessfully at : ${instance.connection}`)
    } catch (error) {

    }
}

export default db;