const fs = require("fs");
function asyncPromiseifiedFSRead(filepath, encoding) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, encoding, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function setTimeoutPromiseified(delay) {
    return new Promise((resolve, reject) => {
        if (delay && delay > 0) {
            setTimeout(() => {
                resolve(`delayed for ${delay} ms`);
            }, delay);
        } else {
            reject("Invalid delay");
        }
    });
}

// using our promises
asyncPromiseifiedFSRead("a.txt", "utf-8")
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    });

setTimeoutPromiseified(3000)
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    });
