const express = require("express");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");


const router =
    express.Router();

const {
        loginLimiter
    } = require("../middleware/rateLimiter");


// ========================================
// AUTHENTICATION ROUTES
// ========================================

router.post(
    "/register",
    registerUser
);


router.post(
    "/login",
    loginLimiter,
    loginUser
);

router.post(
    "/logout",
    (req, res) => {

        res.clearCookie(
            "accessToken",
            {
                httpOnly: true,

                secure:
                    process.env.NODE_ENV === "production",

                sameSite:
                    process.env.NODE_ENV === "production"
                        ? "strict"
                        : "lax",

                path: "/"
            }
        );


        return res.json({

            success: true,

            message:
                "Logged out successfully."

        });

    }
);

module.exports = router;