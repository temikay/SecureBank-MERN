const SecurityLog = require("../models/SecurityLog");

const logSecurityEvent = async ({
    userId = null,
    eventType,
    description,
    severity = "LOW",
    req = null,
    actionTaken = ""
}) => {
    try {
        await SecurityLog.create({
            userId,
            eventType,
            description,
            severity,
            ipAddress: req?.ip || null,
            userAgent: req?.get("User-Agent") || null,
            actionTaken
        });
    } catch (error) {
        console.error(
            "Security logging failed:",
            error.message
        );
    }
};

module.exports = logSecurityEvent;