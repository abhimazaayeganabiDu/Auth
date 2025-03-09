import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.MONGO_URI

const db = () => {

    mongoose
        .connect(uri)
        .then(() => {
            console.log("Connected to db")
        })
        .catch((e) => {
            console.log("Error while connecting to db");

        })
}

export default db;