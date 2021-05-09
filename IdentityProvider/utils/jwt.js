const jwt = require("jsonwebtoken")
const { privateKey } = require("./key")

const ISSUER = "network-security-lab"

const genJwtToken = payload =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      privateKey,
      {
        algorithm: "RS256",
        expiresIn: "1h",
        issuer: ISSUER
      },
      (err, token) => {
        if (err) return reject(err)
        return resolve(token)
      }
    )
  })

module.exports = {
  genJwtToken
}