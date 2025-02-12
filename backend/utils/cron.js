const {CronJob} = require('cron')

const Archieved = require('../models/ArchievedMessage')
const Message = require('../models/Message');
const { Op } = require('sequelize');

const cronJob = CronJob.from({
	cronTime: '0 0 * * *',
	onTick: async function () {
		const archievedMessages = await Message.findAll({where : {
            createdAt : {
                [Op.lt] : new Date()
            }
        }})
        archievedMessages.forEach(async message =>{
            console.log(message)
            console.log(message.toJSON())
            const data = message.toJSON()
            await Archieved.create(data)
            message.destroy()
        })
	},
    //start: true means the cron job starts running immediately after being created.
	start: true,
	timeZone: 'Asia/Kolkata'
});

module.exports = cronJob