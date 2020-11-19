module.exports = {
    commands: ['help'],
    expectedArgs: '',
    permissionError: 'Insufficant Permissions',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text) => {
     message.reply(`
     Poro Bot Help:
    
     My Defult Prefix is "p!"
     if you would like to change it, please use [Administrator only]:
     p!setprefix (New prefix here with out brackets)

     Theese are my currently supported commands:
     ***prefix + help*** - Displays this help page
     ***prefix + poro*** - Sends a picture of a poro to the requested channel
     ***prefix + setwelcome*** - Sets a welcome message for any new user who joins, also sends random poro picture. To tag people in the welcome message, use <@> as the placeholder [Administrator only]
     ***prefix + ping*** - Pong!
     
     If you would like to check out the source code of this project, go to: https://bit.ly/2GBekxO
     `)
    },

}

