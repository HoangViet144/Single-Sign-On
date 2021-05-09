const fs = require("fs")
const path = require("path")

const publicKeyFilePath = path.resolve(__dirname, "./rsa.public")

const publicKey = fs.readFileSync(publicKeyFilePath)

module.exports = {
  publicKey
}