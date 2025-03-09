import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
import db from './utils/db.js';
// import cors from 'cors';

import userRoute from './routes/User.route.js';

const port = process.env.PORT || 3000;
const app = express();

dotenv.config();
db();
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//     methods: ["GET", "POST", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
// }))

// routes
app.get("/", (req, res) => {
    res.send("hello world");
})
app.use("/api/v1/user", userRoute)


app.listen(port, () => {
    console.log(`Server is listen on port : ${port}`);

})