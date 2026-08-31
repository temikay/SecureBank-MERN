const express = require("express");

const authenticate =
    require("../middleware/auth");


const router =
    express.Router();


router.get(
    "/me",
    authenticate,
    (req, res) => {

        res.json({

            success: true,

            user: {

                id:
                    req.user._id,

                name:
                    req.user.name,

                email:
                    req.user.email,

                accountNumber:
                    req.user.accountNumber,

                balance:
                    req.user.balance,

                role:
                    req.user.role,

                lastLogin:
                    req.user.lastLogin

            }

        });

    }
);


module.exports = router;