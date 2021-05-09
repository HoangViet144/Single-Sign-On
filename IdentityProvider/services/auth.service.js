const URL = require("url").URL
const { v4: uuidv4 } = require('uuid')
const query = require("../database/query")
const { genJwtToken } = require("../utils/jwt")
const CryptoJS = require("crypto-js")

const AUTH_HEADER = "authorization"
const BEARER_AUTH = "bearer"
const PORT = process.env.PORT || 3001
const allowedServiceProvider = {
  "https://serviceprovider.herokuapp.com": true,
  "http://localhost:4001": true,
  "https://localhost:4001": true
}
const appTokenDB = {
  "http://www.google.com": "l1Q7zkOL59cRqWBkQ12ZiGVW2DBL",
  "https://serviceprovider.herokuapp.com": "l1Q7zkOL59cRqWBkQ12ZiGVW2DBL",
  "http://localhost:4001": "l1Q7zkOL59cRqWBkQ12ZiGVW2DBL",
  "https://localhost:4001": "l1Q7zkOL59cRqWBkQ12ZiGVW2DBL"
}
const globalStateUserSession = {}

const getToken = () => {
  return uuidv4()
}

const parseAuthHeader = (headerValue) => {
  if (typeof headerValue !== "string") {
    return null
  }
  const re = /(\S+)/g
  const matches = headerValue.match(re)
  return matches && { key: matches[0], value: matches[1] }
}
const getAppTokenFromRequest = (request) => {
  let token = null
  if (request.headers[AUTH_HEADER]) {
    const authParams = parseAuthHeader(request.headers[AUTH_HEADER])
    if (authParams && BEARER_AUTH.toLowerCase() === authParams.key.toLowerCase()) {
      token = authParams.value
    }
  }
  return token
}

const generatePayload = async (sessionToken, username) => {
  const queryRes = await query.getUserInfo(username)
  const userRole = queryRes.map(row => row.role)
  const payload = {
    sessiontoken: sessionToken,
    username: username,
    roles: userRole
  }
  return payload
}

const validateLogin = async (req, res, next) => {
  // validate service provider
  const { serviceURL } = req.query
  if (serviceURL != null) {
    const url = new URL(serviceURL)
    if (!allowedServiceProvider[url.origin]) {
      return res.status(400).json({ message: "Invalid service provider." })
    }
  }

  if (req.session.user != null && serviceURL == null) {
    return res.render("successful", {
      title: "CAS | Login"
    })
  }

  // generate ssoToken
  if (req.session.user != null && serviceURL != null) {
    const url = new URL(serviceURL)
    const ssoToken = getToken()
    if (!await query.storeToken(url.origin, req.session.user, ssoToken, globalStateUserSession[req.session.user])) {
      return res.status(500).json({ message: "Internal server error" })
    }
    return res.redirect(`${serviceURL}?token=${ssoToken}`)
  }

  return res.render("login", {
    title: "CAS | Login"
  })
}

const login = async (req, res, next) => {
  // validate with username and password
  const { username, password } = req.body
  if (! await query.checkLogin(username, CryptoJS.SHA512(password).toString())) {
    return res.status(404).json({ message: "Invalid email or password" })
  }

  // generate sessionToken
  const { serviceURL } = req.query
  const sessionToken = getToken()
  req.session.user = sessionToken
  globalStateUserSession[sessionToken] = username
  if (serviceURL == null) {
    return res.render("successful", {
      title: "CAS | Login"
    })
  }

  // generate ssoToken
  const url = new URL(serviceURL)
  const ssoToken = getToken()
  if (!await query.storeToken(url.origin, sessionToken, ssoToken, username)) {
    return res.render()
  }
  return res.redirect(`${serviceURL}?token=${ssoToken}`);
}

const verifySsoToken = async (req, res, next) => {
  // get appToken from bearer auth header
  const appToken = getAppTokenFromRequest(req)

  // get ssoToken
  const { ssoToken } = req.query
  if (appToken == null || ssoToken == null) {
    return res.status(400).json({ message: "Bad request" })
  }
  const queryOut = await query.getSessionInfo(ssoToken)

  // no ssoToken found => login again
  if (queryOut === null) return res.redirect("/cas/login")
  const { urlOrigin, sessionToken, username } = queryOut

  // validate appToken
  if (appToken !== appTokenDB[urlOrigin]) {
    return res.status(403).json({ message: "Unauthorized" })
  }

  // generate payload
  const payload = await generatePayload(sessionToken, username)

  // encrypt with rs256
  const token = await genJwtToken(payload)
  return res.status(200).json({ token })
}

const validateRegister = async (req, res, next) => {
  // validate with username and password
  const { username, password } = req.body
  if (! await query.insertUser(username, CryptoJS.SHA512(password).toString())) {
    return res.render("register", {
      title: "CAS | Register",
      errmess: "Invalid email or password"
    })
  }
  return res.redirect("/cas/login")
}
const register = (req, res, next) => {
  return res.render("register", {
    title: "CAS | Register",
    errmess: ""
  })
}
const logout = async (req, res, next) => {
  const { sessionToken, serviceURL } = req.query

  if (sessionToken === null || sessionToken === undefined || !await query.deleteSession(sessionToken)) {
    return res.status(500).json({ message: "Interal server error" })
  }
  req.session.destroy()
  console.log("redirect to", serviceURL)
  return res.redirect(serviceURL)
}
module.exports = {
  login,
  validateLogin,
  verifySsoToken,
  register,
  validateRegister,
  logout
}