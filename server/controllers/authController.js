const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const logSecurityEvent = require("../utils/securityLogger");
const generateAccountNumber = require("../utils/generateAccount");


// ========================================
// REGISTER USER
// ========================================

const registerUser = async (req, res) => {

    try {

        let {
            name,
            email,
            password
        } = req.body;


        // ========================================
        // NORMALIZE INPUT
        // ========================================

        name =
            typeof name === "string"
                ? name.trim()
                : "";

        email =
            typeof email === "string"
                ? email.trim().toLowerCase()
                : "";

        password =
            typeof password === "string"
                ? password
                : "";


        // ========================================
        // NAME VALIDATION
        // ========================================

        if (!name) {

            return res.status(400).json({
                success: false,
                message: "Full name is required."
            });

        }

        if (
            name.length < 2 ||
            name.length > 100
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Name must be between 2 and 100 characters."
            });

        }


        // ========================================
        // EMAIL VALIDATION
        // ========================================

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide a valid email address."
            });

        }


        // ========================================
        // PASSWORD VALIDATION
        // ========================================

        if (
            password.length < 8 ||
            password.length > 128
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be between 8 and 128 characters."
            });

        }


        const hasUppercase =
            /[A-Z]/.test(password);

        const hasLowercase =
            /[a-z]/.test(password);

        const hasNumber =
            /[0-9]/.test(password);


        if (
            !hasUppercase ||
            !hasLowercase ||
            !hasNumber
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must contain uppercase, lowercase, and a number."
            });

        }


        // ========================================
        // CHECK EXISTING USER
        // ========================================

        const existingUser =
            await User.findOne({
                email
            });


        if (existingUser) {

            await logSecurityEvent({
                eventType: "SUSPICIOUS_REQUEST",
                description:
                    `Registration attempt using existing email: ${email}`,
                severity: "LOW",
                req,
                actionTaken:
                    "Registration rejected"
            });


            return res.status(409).json({
                success: false,
                message:
                    "Unable to create account with the supplied information."
            });

        }


        // ========================================
        // HASH PASSWORD
        // ========================================

        const passwordHash =
            await bcrypt.hash(
                password,
                12
            );


        // ========================================
        // GENERATE ACCOUNT NUMBER
        // ========================================

        let accountNumber;

        let accountExists = true;


        while (accountExists) {

            accountNumber =
                generateAccountNumber();

            accountExists =
                await User.exists({
                    accountNumber
                });

        }


        // ========================================
        // CREATE USER
        // ========================================

        const user =
            await User.create({

                name,

                email,

                passwordHash,

                accountNumber,

                balance: 100000,

                role: "customer"

            });


        // ========================================
        // SECURITY LOG
        // ========================================

        await logSecurityEvent({

            userId: user._id,

            eventType:
                "ACCOUNT_CREATED",

            description:
                "New SecureBank account created.",

            severity:
                "LOW",

            req,

            actionTaken:
                "Account successfully created"

        });


        // ========================================
        // RESPONSE
        // ========================================

        return res.status(201).json({

            success: true,

            message:
                "Account created successfully.",

            accountNumber:
                user.accountNumber

        });

    }

    catch (error) {

        console.error(
            "Registration error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to create account at this time."

        });

    }

};

// ========================================
// LOGIN USER
// ========================================

const loginUser = async (req, res) => {

    try {

        let {
            email,
            password
        } = req.body;


        // ========================================
        // NORMALIZE INPUT
        // ========================================

        email =
            typeof email === "string"
                ? email.trim().toLowerCase()
                : "";

        password =
            typeof password === "string"
                ? password
                : "";


        // ========================================
        // BASIC VALIDATION
        // ========================================

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required."
            });

        }


        // ========================================
        // FIND USER
        // Explicitly request passwordHash
        // ========================================

        const user =
            await User.findOne({ email })
                .select("+passwordHash");


        // ========================================
        // GENERIC ERROR
        // Prevents account enumeration
        // ========================================

        if (!user) {

            await logSecurityEvent({

                eventType:
                    "LOGIN_FAILURE",

                description:
                    "Login attempt for an unrecognized account.",

                severity:
                    "LOW",

                req,

                actionTaken:
                    "Login rejected"

            });


            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password."
            });

        }


        // ========================================
        // ACCOUNT LOCK CHECK
        // ========================================

        if (
            user.lockedUntil &&
            user.lockedUntil > new Date()
        ) {

            const remainingTime =
                Math.ceil(
                    (
                        user.lockedUntil -
                        new Date()
                    ) / 60000
                );


            await logSecurityEvent({

                userId:
                    user._id,

                eventType:
                    "ACCOUNT_LOCKED",

                description:
                    "Login attempt on a temporarily locked account.",

                severity:
                    "HIGH",

                req,

                actionTaken:
                    "Login rejected while account is locked"

            });


            return res.status(423).json({

                success: false,

                message:
                    `Account temporarily locked. Try again in ${remainingTime} minute(s).`

            });

        }


        // ========================================
        // COMPARE PASSWORD
        // ========================================

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.passwordHash
            );


        // ========================================
        // INVALID PASSWORD
        // ========================================

        if (!passwordMatch) {

            user.failedLoginAttempts += 1;


            const MAX_ATTEMPTS = 5;


            // ========================================
            // ACCOUNT LOCK
            // ========================================

            if (
                user.failedLoginAttempts >=
                MAX_ATTEMPTS
            ) {

                user.lockedUntil =
                    new Date(
                        Date.now() +
                        15 * 60 * 1000
                    );


                user.failedLoginAttempts = 0;


                await user.save();


                await logSecurityEvent({

                    userId:
                        user._id,

                    eventType:
                        "ACCOUNT_LOCKED",

                    description:
                        "Account locked after repeated failed login attempts.",

                    severity:
                        "HIGH",

                    req,

                    actionTaken:
                        "Account locked for 15 minutes"

                });


                return res.status(423).json({

                    success: false,

                    message:
                        "Too many failed login attempts. Account temporarily locked for 15 minutes."

                });

            }


            await user.save();


            await logSecurityEvent({

                userId:
                    user._id,

                eventType:
                    "LOGIN_FAILURE",

                description:
                    `Invalid password. Failed attempt ${user.failedLoginAttempts} of ${MAX_ATTEMPTS}.`,

                severity:
                    user.failedLoginAttempts >= 3
                        ? "MEDIUM"
                        : "LOW",

                req,

                actionTaken:
                    "Login rejected"

            });


            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        // ========================================
        // SUCCESSFUL LOGIN
        // ========================================

        user.failedLoginAttempts = 0;

        user.lockedUntil = null;

        user.lastLogin = new Date();

        await user.save();


        // ========================================
        // SECURITY LOG
        // ========================================

        await logSecurityEvent({

            userId:
                user._id,

            eventType:
                "LOGIN_SUCCESS",

            description:
                "User authenticated successfully.",

            severity:
                "LOW",

            req,

            actionTaken:
                "Login successful"

        });


        // ========================================
        // RESPONSE
        // ========================================

        const token = jwt.sign(
    {
        userId: user._id.toString(),
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn:
            process.env.JWT_EXPIRES_IN || "15m"
    }
);


res.cookie(
    "accessToken",
    token,
    {
        httpOnly: true,

        secure:
            process.env.NODE_ENV === "production",

        sameSite:
            process.env.NODE_ENV === "production"
                ? "strict"
                : "lax",

        maxAge:
            15 * 60 * 1000,

        path: "/"
    }
);


return res.status(200).json({

    success: true,

    message:
        "Login successful.",

    user: {

        id:
            user._id,

        name:
            user.name,

        email:
            user.email,

        accountNumber:
            user.accountNumber,

        balance:
            user.balance,

        role:
            user.role

    }

});

    }

    catch (error) {

        console.error(
            "Login error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to process login at this time."

        });

    }

};

module.exports = {
    registerUser,
    loginUser
};