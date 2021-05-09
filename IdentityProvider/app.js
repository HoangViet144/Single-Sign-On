const express = require('express')
const session = require('express-session')
const engine = require("ejs-mate")
const cron = require("node-cron")
const app = express()
const router = require("./router")
const query = require("./database/query")

cron.schedule('0 */15 * * * *', function () {
  query.cleanUpSession()
})
app.use(
  session({
    secret: "Identity server",
    resave: false,
    saveUninitialized: true,
    expires: new Date(Date.now() + 3600)
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
  console.log(req.session)
  next()
})

app.engine("ejs", engine)
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")

app.use("/cas", router)

app.get("/", (req, res, next) => {
  res.redirect("/cas/login")
})

// 404 handler
app.use((req, res, next) => {
  const err = new Error("404 Not Found");
  err.status = 404;
  next(err)
})

app.use((err, req, res, next) => {
  // console.error({
  //   message: err.message,
  //   error: err,
  // })
  const statusCode = err.status || 500;
  let message = (statusCode !== 500 ? err.message : "Internal Server Error")
  res.status(statusCode).json({ message })
})
module.exports = app