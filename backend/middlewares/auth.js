const jwt = require('jsonwebtoken')
const User = require('../models/User')


const authenticate = async (req, res, next) => {
    try {
        const token = req.headers['auth-token']
        const data = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findByPk(data.id)
        req.user = user
        next()
    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
}


const socketAuthenticate = async(socket, next) => {
    console.log('demo')
    const token = socket.handshake.auth.token
    if(token){

 
    const data = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(data.id)
    socket.user = user
    next()
    }else{
        next(new Error("token not found"))
    }
}


module.exports = { auth: authenticate, socketAuthenticate };