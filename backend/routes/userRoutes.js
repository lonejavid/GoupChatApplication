const express = require('express')

const router = express.Router()

const userController = require('../controllers/userControllers')
const {auth} = require('../middlewares/auth')

router.post('/create' , userController.createUser)
router.post('/login' , userController.login)


module.exports = router;