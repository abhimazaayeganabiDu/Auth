import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    varificationToken: {
        type: String,
    },
    passwordResetToken: {
        type: String,
    }

}, { timeStames: true })

userSchema.pre("save", async (next) => {
    if(this.isModified("password")) {
        const hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword;
    }
    next()
})

const User = mongoose.model("User", userSchema);

export default User;