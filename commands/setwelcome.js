const mongo = require('../mongo')
const welcomeSchema = require('../schemas/welcome-schema')
const Mongoose = require('mongoose')
const { on } = require('../schemas/welcome-schema')

module.exports = {
    commands: ['setwelcome'],
    expectedArgs: '(Welcome here)',
    permissionError: 'Insufficant Permissions',
    minArgs: 1,
    maxArgs: 10000,
    permissions: 'ADMINISTRATOR',
    callback: async (client, message, arguments, text) => {
        const cache = {}

        console.log ({ member, channel, content, guild })


        cache[guild.id] = [channel.id, text]

        await mongo().then(async (Mongoose) => {
            try {
                await welcomeSchema.findOneAndUpdate(
                    {
                    _id: guild.id
                }, {
                        _id: guild.id,
                        channelId: channel.id,
                        text, 
                }, {
                    upsert: true
                })
            }finally{
                channel.send('Updated Welcome Message')
                Mongoose.connection.close()
            }
        })
        const onJoin = async member => {
            const { guild } = member
    
            let data = cache[guild.id]
    
            if (!data) {
                console.log('Fetching Data From Mongo')
    
                await mongo().then(async mongoose => {
                    try{
                        const result = await welcomeSchema.findOne({ _id: guild.id })
                        cache[guild.id] = data = [result.channelId, result.text]
                    }finally{
                        mongoose.connection.close()
                    }
                })
            }
            const channelId = data[0]
            const text = data[1]
            
            number = 155;
            imageNumber = Math.floor (Math.random() * (number - 1 + 1)) + 1;
    
    
            const channel = guild.channels.cache.get(channelId)
            channel.send(text.replace(/<@>/g, `<@${member.id}>`))
            channel.send ( {files: ["./poro_pics/" + imageNumber + ".jpg"] } )
            
            
            
            
            //<0>
        }
    
        client.on('guildMemberAdd', member => {
            onJoin(member)
        })
    },

}

