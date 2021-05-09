const express = require("express")
const engine = require("ejs-mate")
const session = require("express-session")

const app = express()
const checkAuth = require("./services/checkAuth")
const checkSSO = require("./services/checkSSO")
const logout = require("./services/logout")

app.use(
  session({
    secret: "Service server",
    resave: false,
    saveUninitialized: true
  })
);

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.engine("ejs", engine)
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")
app.use(checkSSO())

app.get("/", (req, res, next) => {
  const { user } = req.session
  const username = user ? user.username : "anonymous"
  return res.render("index", {
    what: `Hello ${username}`,
    title: "Service Provider | Home",
    login: username === "anonymous" ? "Login" : "",
    logout: username === "anonymous" ? "" : "Logout"
  })
})
app.get("/login", checkAuth, (req, res, next) => {
  return res.status(200).json({ me: "me" })
})
app.get("/logout", logout)
// 404 handler
app.use((req, res, next) => {
  const err = new Error("404 Not Found")
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  const statusCode = err.status || 500
  let message = (statusCode !== 500 ? err.message : "Internal Server Error")
  res.status(statusCode).json({ message })
})
module.exports = app