const { Op } = require('sequelize');
const Group = require('../models/Group');
const Member = require('../models/Member');
const User = require('../models/User');


exports.removeMember = async (req, res) => {
    try {
        const groups = await req.user.getGroups({ where: { id: req.params.groupId }});
        const member = groups[0].member;
        const userId = req.body.userId;
        
        if (!member.admin) return res.status(403).json({ msg: "You don't have permission" });
        
        const users = await groups[0].getUsers({ where: { id: userId }});
        if (users.length !== 1) return res.status(404).json({ msg: "User does not exist" });

        const user = users[0].member;
        if (user.creator) return res.status(403).json({ msg: "You don't have permission" });

        await user.destroy();
        return res.json({ success: true, msg: "User removed" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
};


exports.makeAdmin = async(req,res)=>{
changeAdmin(true ,req,res)
}

exports.removeAdmin = async(req,res)=>{
changeAdmin(false , req,res)
}

async function changeAdmin(value, req, res) {
    try {
        // Fetching the groups associated with the current user
        const groups = await req.user.getGroups({ where: { id: req.params.groupId }});
        
        // Extracting the member from the first group found
        const member = groups[0].member;

        // Extracting groupId and userId from the request parameters
        const groupId = req.params.groupId;
        const userId = req.body.userId;

        // Checking if the member is an admin
        if (!member.admin) {
            return res.status(403).json({ msg: "You don't have permission" });
        }

        // Fetching the user with the given userId from the group
        const members = await groups[0].getUsers({ where: { id: userId }});
        
        // If a user with the given userId is found in the group
        if (members.length === 1) {
            const user = members[0].member;
            
            // Updating the user's admin status
            user.admin = value;
            await user.save();

            // Creating a message based on the value
            let msg;
            if (value) {
                msg = "User promoted to admin";
            } else {
                msg = "Admin status removed from user";
            }

            // Returning success message
            return res.json({ success: true, msg });
        } else {
            // If no user with the given userId is found
            return res.status(404).json({ msg: "User does not exist" });
        }    
    } catch (e) {
        // Handling any errors that occur during execution
        console.log(e);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
}


exports.showUser = async(req,res)=>{
    try{
        const groups = await req.user.getGroups({where : {id : req.params.groupId}});
        const group = groups[0]
        const member = group.member
        const users = await group.getUsers()
        const usersId = users.map(user => user.id)
        if(member.admin){
            const result = await User.findAll({
                where :{
                    id :{
                        [Op.notIn] : usersId
                    }
                },
                attributes : {
                    exclude : ['password']
                }
            })
            return res.json(result)
        }else{
            return res.json({msg :"You don't have the required permissions"})
        }
        

    }catch(e){
        console.log(e)
        return res.status(500).json({success : false , msg :"Internal server error"})
    }
}

exports.addUser = async(req,res)=>{
    try{
        const groupId = req.params.groupId;
        const groups = await req.user.getGroups({where : {id : groupId}})
        const group = groups[0]
        const member = group.member
        const id = req.body.id
        if(member.admin){
            const user = await User.findByPk(id)
            const newUser = await group.addUser(user)
            return res.json({user : newUser , msg :"New User added successfully"})
        }else{
            return res.json({msg :"You don't have the required permissions"})
        }
    }catch(e){
        console.log(e)
        return res.status(500).json({success : false , msg :"Internal server error"})
    }
}