const express = require("express");
const router = express.Router();

const AppError = require("../errors/appError");

const verifyPassword = (req, res, next) => {
    if (req.query.pass === "chicken") {
        next();
    }
    throw new AppError("", 401);
    // throw new Error("Passphrase required!");
    // res.send("SORRY YOU NEED A PASSWORD!")
}

router.get("/", verifyPassword, (req, res) => {
    res.send("JACKEDY JACKA JACKA!!!")
})

module.exports = router;