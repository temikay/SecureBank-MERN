const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 254
        },

        passwordHash: {
            type: String,
            required: true,
            select: false
        },

        accountNumber: {
            type: String,
            required: true,
            unique: true
        },

        balance: {
            type: Number,
            default: 100000,
            min: 0
        },

        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer"
        },

        failedLoginAttempts: {
            type: Number,
            default: 0
        },

        lockedUntil: {
            type: Date,
            default: null
        },

        lastLogin: {
            type: Date,
            default: null
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);