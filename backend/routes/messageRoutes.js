const express = require('express')

const router = express.Router()

const {auth} = require('../middlewares/auth')
const messageControllers = require('../controllers/messageControllers')
const upload = require('../utils/multer')


router.post('/add-message' , auth , messageControllers.addMessage)
router.get('/get-messages/:groupId' , auth , messageControllers.getMessages)
router.post('/upload-file/:groupId' ,auth , upload.single('file') ,messageControllers.uploadFile)

module.exports = router;