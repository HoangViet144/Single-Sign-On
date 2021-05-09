const { pool } = require('./config')

const storeToken = async (urlOrigin, sessiontoken, ssotoken, username) => {
  try {
    const queryStr = 'INSERT INTO sessions(urlorigin, sessiontoken, ssotoken, username, time) VALUES($1, $2, $3, $4, current_timestamp)'
    const results = await pool.query(queryStr, [urlOrigin, sessiontoken, ssotoken, username])
    return true
  } catch (err) {
    console.log(err.stack)
    return false
  }
  return false
}
const insertUser = async (username, password) => {
  const queryStr = "INSERT INTO users(username, password) VALUES($1, $2)"
  try {
    const results = await pool.query(queryStr, [username, password])
    return true
  } catch (err) {
    console.log(err.stack)
    return false
  }
}
const checkLogin = async (username, password) => {
  const queryStr = 'SELECT * from users WHERE username = $1 and password = $2 '
  try {
    const results = await pool.query(queryStr, [username, password])
    if (results === null || results === undefined) return false
    return results.rows.length > 0
  } catch (err) {
    console.log(err.stack)
    return false
  }
}
const getSessionInfo = async (ssoToken) => {
  const queryStr = 'SELECT * from sessions WHERE ssotoken = $1'
  try {
    const results = await pool.query(queryStr, [ssoToken])
    if (results === null || results === undefined) return null
    if (results.rows.length !== 1) return null
    return {
      urlOrigin: results.rows[0].urlorigin,
      sessionToken: results.rows[0].sessiontoken,
      username: results.rows[0].username
    }
  } catch (err) {
    console.log(err.stack)
    return null
  }
}
const getUserInfo = async (username) => {
  const queryStr = 'SELECT role from roles WHERE username = $1'
  try {
    const results = await pool.query(queryStr, [username])
    if (results === null || results === undefined) return null
    return results.rows
  } catch (err) {
    console.log(err.stack)
    return null
  }
}
const cleanUpSession = async () => {
  const queryStr = "DELETE FROM sessions WHERE time < (NOW()-INTERVAL '1 HOUR')"
  try {
    console.log("start cleaning sessions ...")
    const results = await pool.query(queryStr)
  } catch (err) {
    console.log(err.stack)
  }
}
const deleteSession = async (sessionToken) => {
  const queryStr = "DELETE FROM sessions WHERE sessiontoken= $1"
  try {
    const results = await pool.query(queryStr, [sessionToken])
    return true
  } catch (err) {
    console.log(err.stack)
    return false
  }
}
module.exports = {
  storeToken,
  checkLogin,
  getSessionInfo,
  getUserInfo,
  cleanUpSession,
  insertUser,
  deleteSession
}