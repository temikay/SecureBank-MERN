const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 1
        },

        description: {
            type: String,
            maxlength: 200,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "completed",
                "blocked",
                "pending"
            ],
            default: "completed"
        },

        riskScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        }
    },

    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "Transaction",
        transactionSchema
    );