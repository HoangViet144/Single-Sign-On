const express = require('express')
const router = express.Router()

const authService = require('../services/auth.service')

router.post('/login', authService.login)
router.get('/login', authService.validateLogin)
router.get('/verifysso', authService.verifySsoToken)
router.get('/register', authService.register)
router.post('/register', authService.validateRegister)
router.get('/logout', authService.logout)

module.exports = router