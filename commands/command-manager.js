/**
 * Command Handler from Worn Off Keys
 * Its good thats why im using it
 * but expect some changes still
 */

const mongo = require('../mongo')
const commandPrefixSchema = require('../schemas/command-prefix-schema')
const { prefix: globalPrefix } = require('../config.json')
const guildPrefixes = {}
const { Mongoose, connection } = require('mongoose')

const validatePermissions = (permissions) => {
  const validPermissions = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
  ]

    for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
          throw new Error(`Unknown permission "${permission}"`)
        }
      }
    }

module.exports = (client, commandOptions) => {
    let {
        commands,
        expectedArgs = '',
        permissionError = 'Insufficant Permission.',
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        requiredRoles = [],
        callback,
      } = commandOptions

    // Ensure command is array
    if (typeof commands === 'string') {
        commands = [commands]
    }

    console.log(`Registering the command "${commands[0]}"`)

    // Ensure permissions are in an array
    if (permissions.length) {
        if (typeof permissions === 'string') {
          permissions = [permissions]
        }
    
        validatePermissions(permissions)
      }

    // Listen for incoming messages
    client.on('message', (message) => {
        const { member, content, guild } = message

        const prefix = guildPrefixes[guild.id] || globalPrefix

        for (const alias of commands) {
            if (content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)) {

                // Ensure user has sufficant permissions
                for (const permission of permissions) {
                    if (!member.hasPermission(permission)) {
                        message.reply(permissionError)
                        return
                    }
                }
                
                // Ensure user has sufficant role
                for (const requiredRole of requiredRoles) {
                    const role = guild.roles.cache.find(role => role.name === requiredRole)

                    if (!role || !member.roles.cache.has(role.id)) {
                        message.reply(`You must have the "${requiredRoles}" role to execute this command`)
                        return
                    }
                }

                const arguments = content.split(/[ ]+/)

                // Remove Command
                arguments.shift()

                // Ensure we have correct # of args
                if (arguments.length < minArgs || (
                    maxArgs !==null && arguments.length > maxArgs
                )) {
                    // Syntax Error
                    message.reply(`Invalid syntax. Use ${prefix}${alias} ${expectedArgs}`)
                    return
                }

                // Handle the commands actually code:
                callback(message, arguments, arguments.join(' '))

                return
            }
        }
    })
}

module.exports.updateCache = (guildId, newPrefix) => {
  guildPrefixes[guildId] = newPrefix
}

module.exports.loadPrefixes = async (client) => {
  await mongo().then(async (mongoose) => {
    try {
      for (const guild of client.guilds.cache) {
        const guildId = guild[1].id

        const result = await commandPrefixSchema.findOne({ _id: guildId })
        guildPrefixes[guildId] = result.prefix
      }

      console.log(guildPrefixes)
    } finally {
      mongoose.connection.close()
    }
  })
}