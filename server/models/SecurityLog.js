const mongoose = require("mongoose");

const securityLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        eventType: {
            type: String,
            required: true,
            enum: [
                "ACCOUNT_CREATED",
                "LOGIN_SUCCESS",
                "LOGIN_FAILURE",
                "ACCOUNT_LOCKED",
                "RATE_LIMIT_TRIGGERED",
                "SUSPICIOUS_REQUEST",
                "UNAUTHORIZED_ACCESS",
                "INJECTION_ATTEMPT",
                "XSS_ATTEMPT",
                "TRANSACTION_BLOCKED"
            ]
        },

        description: {
            type: String,
            required: true,
            maxlength: 500
        },

        severity: {
            type: String,
            enum: [
                "LOW",
                "MEDIUM",
                "HIGH",
                "CRITICAL"
            ],
            default: "LOW"
        },

        ipAddress: {
            type: String,
            maxlength: 100
        },

        userAgent: {
            type: String,
            maxlength: 500
        },

        actionTaken: {
            type: String,
            maxlength: 300
        }
    },

    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("SecurityLog", securityLogSchema);