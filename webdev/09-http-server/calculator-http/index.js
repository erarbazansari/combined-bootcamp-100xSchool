const http = require("http");

const port = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    if (pathname === "/") {
        res.end("server is running...");
    } else if (pathname === "/add") {
        const a = parseInt(parsedUrl.searchParams.get("a"));
        const b = parseInt(parsedUrl.searchParams.get("b"));

        if (isNaN(a) || isNaN(b)) {
            res.statusCode = 400;
            res.end("Please provide valid numbers for a and b");
        } else {
            const sum = a + b;
            res.end(`sum of ${a} and ${b} is ${sum}`);
        }
    } else {
        res.statusCode = 404;
        res.end("404 Not Found");
    }
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
