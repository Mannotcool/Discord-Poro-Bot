module.exports = {
    commands: ['poro'],
    expectedArgs: '',
    permissionError: 'Insufficant Permissions',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text) => {
        number = 155;
        imageNumber = Math.floor (Math.random() * (number - 1 + 1)) + 1;
        message.reply( {files: ['./poro_pics/' + imageNumber + ".jpg"] } )
    },

}

