const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

function verifyToken(req, res, next) {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.json({ msg: "token required" });
        }
        const t = token.split(" ")[1];
        jwt.verify(t, jwtSignature);
        next();
    } catch (err) {
        return res.json({ msg: "invalid user" });
    }
}

module.exports = { verifyToken };
