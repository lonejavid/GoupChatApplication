const sequelize = require('../utils/db')

const Sequelize = require('sequelize')


const Group = sequelize.define('group' , {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        allowNull : false
    },
   
    name:{
        type : Sequelize.STRING,
        allowNull : false
    }
})

module.exports = Group;