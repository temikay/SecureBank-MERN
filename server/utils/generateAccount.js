const crypto = require("crypto");

function generateAccountNumber() {

    const randomNumber =
        crypto.randomInt(
            1000000000,
            9999999999
        );

    return randomNumber.toString();
}

module.exports = generateAccountNumber;