const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

const authRoutes =
    require("./routes/authRoutes");

const userRoutes =
    require("./routes/userRoutes");


// ========================================
// ENVIRONMENT CONFIGURATION
// ========================================

dotenv.config();


// ========================================
// DATABASE
// ========================================

connectDB();


// ========================================
// EXPRESS APP
// ========================================

const app = express();


// ========================================
// SECURITY HEADERS
// ========================================

app.use(
    helmet()
);


// ========================================
// CORS
// ========================================

app.use(
    cors({
        origin:
            process.env.CLIENT_URL ||
            "http://localhost:5173",

        credentials: true
    })
);


// ========================================
// BODY PARSING
// ========================================

app.use(
    express.json({
        limit: "10kb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10kb"
    })
);


// ========================================
// COOKIE PARSER
// IMPORTANT:
// Must come BEFORE protected routes
// ========================================

app.use(
    cookieParser()
);


// ========================================
// GENERAL RATE LIMITER
// ========================================

const generalLimiter =
    rateLimit({

        windowMs:
            15 * 60 * 1000,

        limit:
            100,

        standardHeaders:
            "draft-8",

        legacyHeaders:
            false,

        message: {

            success: false,

            message:
                "Too many requests. Please try again later."

        }

    });


app.use(
    generalLimiter
);


// ========================================
// AUTHENTICATION ROUTES
// ========================================

app.use(
    "/api/auth",
    authRoutes
);


// ========================================
// USER ROUTES
// Protected routes can now read cookies
// ========================================

app.use(
    "/api/users",
    userRoutes
);


// ========================================
// HEALTH CHECK
// ========================================

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            success: true,

            message:
                "SecureBank API is running.",

            security: {

                helmet: true,

                rateLimiting: true,

                cors: true,

                cookieParser: true

            }

        });

    }
);


// ========================================
// ROOT
// ========================================

app.get(
    "/",
    (req, res) => {

        res.json({

            success: true,

            message:
                "Welcome to SecureBank API"

        });

    }
);


// ========================================
// ERROR HANDLER
// ========================================

app.use(
    (err, req, res, next) => {

        console.error(err);

        res.status(500).json({

            success: false,

            message:
                "Internal server error."

        });

    }
);


// ========================================
// MODELS
// ========================================

const User =
    require("./models/User");

const SecurityLog =
    require("./models/SecurityLog");

const Transaction =
    require("./models/Transaction");


console.log(
    "Security models loaded successfully."
);


// ========================================
// START SERVER
// ========================================

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            `SecureBank API running on port ${PORT}`
        );

    }
);