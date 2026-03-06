const express = require("express");

const port = 3000;

const app = express();
app.use(express.static("./public"));

app.get("/add", (req, res) => {
    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);

    if (isNaN(a) || isNaN(b)) {
        res.status(400).send("Please provide valid numbers for a and b");
    } else {
        const sum = a + b;
        res.send(`Sum of ${a} and ${b} is ${sum}`);
    }
});

app.get("/multiply/:a/:b", (req, res) => {
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);

    if (isNaN(a) || isNaN(b)) {
        res.status(400).send("Please provide valid numbers for a and b");
    } else {
        const product = a * b;
        res.send(`Product of ${a} and ${b} is ${product}`);
    }
});

app.get("/calculator", (req, res) => {
    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);
    const operator = req.query.operator;

    if (isNaN(a) || isNaN(b)) {
        res.status(400).send("Please provide valid numbers for a and b");
    } else {
        if (operator === "add") {
            res.send((a + b).toString());
        } else if (operator === "subtract") {
            res.send((a - b).toString());
        } else if (operator === "multiply") {
            res.send((a * b).toString());
        } else if (operator === "divide") {
            res.send((a / b).toString());
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
