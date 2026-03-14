const express = require("express");
const { verifyToken } = require("./auth.middleware");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(express.static("public"));
const jwtSignature = "arbaz ansari";

// in-memory
let id = 0;
let notes = [];
let users = [];

// auth routes
app.post("/signup", (req, res) => {
    const { email, password } = req.body;

    if (!email && !password) {
        return res.json({
            msg: "all fields are required",
        });
    }

    const isUserExist = users.find((u) => u.email === email);
    if (isUserExist) {
        return res.json({
            msg: "user already exist, plz try to signin",
        });
    }
    users.push({ email, password });
    return res.json({
        msg: "user created!",
    });
});
app.post("/signin", (req, res) => {
    const { email, password } = req.body;

    if (!email && !password) {
        return res.json({
            msg: "all fields are required",
        });
    }

    const isUserExist = users.find(
        (u) => u.email === email && u.password === password,
    );
    if (!isUserExist) {
        return res.json({
            msg: "user not found",
        });
    }

    // user is valid from here
    const token = jwt.sign({ email }, jwtSignature);
    return res.json({
        msg: "sign in success",
        token,
    });
});

// notes app routes
app.get("/notes", verifyToken, (req, res) => {
    return res.json({
        notes,
    });
});

app.get("/notes/:id", verifyToken, (req, res) => {
    const id = req.params.id;
    console.log(id);
    const note = notes.filter((n) => n.id == id);
    return res.json({
        note,
    });
});

app.post("/notes", verifyToken, (req, res) => {
    const { title, desc } = req.body;
    id++;

    notes.push({ id, title, desc });
    return res.json({
        msg: "added!",
        id,
    });
});

// listers
app.listen(5000, () => console.log("server is running on port 5000"));
