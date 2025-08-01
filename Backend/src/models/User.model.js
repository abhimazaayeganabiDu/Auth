import mongoose from "mongoose";
import {hash} from 'bcrypt'

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
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
        },
        resetPasswordExpires: {
            type: Date,
        },

    },
    {
        timestamps: true,
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    this.password = hash(this.password, 10)
})

export const User = mongoose.model("User", userSchema);

