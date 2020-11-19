const path = require('path')
const fs = require('fs')

const Discord = require('discord.js');
var schedule = require('node-schedule');
const client = new Discord.Client();

// All custom scripts go here:
const config = require('./config.json')
const mongo = require('./mongo.js')
const command = require('./command-handler')
const privateMessage = require('./private-message');
const welcome = require('./welcome');
const CommandBase = require('./commands/command-manager')
const { base } = require('./schemas/welcome-schema');

// Default Prefix
const prefix = ('p!');

// Messaging Easyer
const message = client.message;
const channels = client.channels;
// End of Messageing easyer

// Heroku Ports
const host = '0.0.0.0';
const port = process.env.PORT || 5000;
// End of Heroku Ports



client.once('ready', async () =>{
    // Log that the bot is now online
    console.log('Poro Online!')

    // Mongoose
    await mongo().then((mongoose) => {
        try {
            console.log('Connected to mongo!')
        } finally {
            mongoose.connection.close()
        }
    })

    

    // Command Handler
    const baseFile = 'command-manager.js'
    const commandManager = require(`./commands/${baseFile}`)

    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
          const stat = fs.lstatSync(path.join(__dirname, dir, file))
          if (stat.isDirectory()) {
            readCommands(path.join(dir, file))
          } else if (file !== baseFile) {
            const option = require(path.join(__dirname, dir, file))
            commandManager(client, option)
          }
        }
      }
      
     
      readCommands('commands')
      CommandBase.loadPrefixes(client)

      
      

    // p!help
    command(client, 'help', message => {
        message.channel.send(`
        Poro Bot Help:
        
        Theese are my currently supported commands:
        ***p!help*** - Displays this help page
        ***p!poro*** - Sends a picture of a poro to the requested channel
        ***p!setwelcome*** - Sets a welcome message for any new user who joins, also sends random poro picture. To tag people in the welcome message, use <@> as the placeholder [ADMINISTRATOR ONLY]
        ***p!simjoin*** - Simulates a join [ADMINSTRATOR ONLY]
        ***p!ping*** - Pong!
        
        If you would like to check out the source code of this project, go to: https://bit.ly/2GBekxO
        `)
    })

    // Private Messaging Poro Bot
    privateMessage(client, 'hello', '* Poro Noises *')
    privateMessage(client, 'who is a good poro?', '* Happy Poro Noises *')

    // Welcome:
    welcome(client);
});

client.on('ready', () => {
  client.user.setActivity('League of Legends', { type: 'PLAYING' });
});

client.on ("message", (message) => {

    var j = schedule.scheduleJob('0 16 * * *', function(){
       number = 155;
      imageNumber = Math.floor (Math.random() * (number - 1 + 1)) + 1;
        channels.cache.get('761422403191701555').send( {files: ["./poro_pics/" + imageNumber + ".jpg"] } ); // this is spacific to my server only for now
    });

 
});




client.login(process.env.BOT_TOKEN);
