const { Op } = require('sequelize');
const Message = require('../models/Message');
const User = require('../models/User');
const Group = require('../models/Group');
const Member = require('../models/Member');

module.exports = ( socket) => {
    const addMessage = async (data) => {
        const { groupId, message } = data;

// - Implemented message broadcasting within a group using 'socket.to(groupId).emit(...)'.
// - Includes message content and sender name ('socket.user.name') in the emitted event.
      
        socket.to(groupId).emit('message:recieve-message', message, socket.user.name);
   
    };

    socket.on('joinRoom', async (groupId) => {
        // groupId: This parameter represents the ID of the group that the client (socket) wants to join. 
        //It's  passed from the client-side code when the "joinRoom" event is emitted.
        socket.join(groupId);
    });

    socket.on('message:send-message', addMessage);
};
