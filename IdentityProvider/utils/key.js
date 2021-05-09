const fs = require("fs")
const path = require("path")

const privateKeyFilePath = path.resolve(__dirname, "./rsa.private")

const privateKey = fs.readFileSync(privateKeyFilePath)

module.exports = {
  privateKey
}