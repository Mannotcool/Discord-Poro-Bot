module.exports = (client, triggerText, replayTest) => {
    client.on('message', message => {
        if (
            message.channel.type === 'dm' &&
        message.content.toLowerCase() === triggerText.toLowerCase()
        
        ) {
            
                message.author.send(replayTest);
        }
    })

}