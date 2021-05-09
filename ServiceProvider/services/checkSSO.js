const URL = require("url").URL
const axios = require("axios")

const { verifyJwtToken } = require("../utils/verifyJWT")

const ssoIdentityVerifyToken = "https://sso-service.herokuapp.com/cas/verifysso"

const ssoRedirect = () => {
  return async (req, res, next) => {
    const { token } = req.query
    //console.log("ssotoken", token)
    if (token !== null && token !== undefined) {
      const redirectURL = req.path
      try {
        const response = await axios.get(
          `${ssoIdentityVerifyToken}?ssoToken=${token}`,
          {
            headers: {
              Authorization: "Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL"
            }
          }
        )

        const decoded = await verifyJwtToken(response.data.token)
        //console.log("decoded", decoded)
        req.session.user = decoded
      } catch (err) {
        console.log(err.stack)
        return next(err)
      }
      return res.redirect(`${redirectURL}`)
    }
    return next()
  }
}
module.exports = ssoRedirect