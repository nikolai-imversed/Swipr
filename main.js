const { Client, GatewayIntentBits, Collection, Routes, REST, Message } = require('discord.js')
const fetch = require('node-fetch')
const fs = require('node:fs');
const { targetID, targetHash } = require('./config.js');
const config = require('./config.js');
const { upscale } = require('./requests/requests.js');


const token = config.DAVINCI_TOKEN
const clientId = "1088533676557606993"

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`);
});

client.on('messageCreate', async (msg) => {
    if (msg.attachments.size > 0 && msg.attachments.first().contentType.startsWith('image/')) {
        console.log('Image here');
        const attachmentUrl = msg.attachments.first().url;
        const attachmentName = msg.attachments.first().name
        fetch(attachmentUrl)
            .then(res => res.body.pipe(fs.createWriteStream(`./images/${attachmentName}`)))
    }
});

client.on('messageCreate', async (msg) => {
    if (msg.attachments.size > 0 && msg.attachments.first().contentType.startsWith('image/')) {
        try {
            config.targetID = msg.id
            config.targetHash = msg.attachments.first().url.split('_').pop().split('.')[0]
            console.log(`TargetID = ${config.targetID} \n TargetHash = ${config.targetHash}`)
        } catch (error) {
            await msg.channel.send('Exception occured.. cant send upscale.')
            await msg.delete()
            return
        }
        if (msg.author.id != config.MID_JOURNEY_ID) {
            msg.channel.send('Author is not Midjourney')
            await msg.delete()
            return
        }
        const response = upscale(1, config.targetID, config.targetHash)
        if (response.status >= 400) {
            console.error(response.status)
            return
        }
        await msg.channel.send('DONE')
        await msg.delete() //this might delete image in discord channel tho
    }
});

async function registerCommand() {
    client.commands = new Collection();
    const commandDir = await fs.promises.readdir('./commands')
    const commandFiles = commandDir.filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        console.log(`register command: ${command.data.name}`);

        client.commands.set(command.data.name, command);
    }
}

async function registerCommands() {
    try {
        console.log('Started refreshing application (/) commands.');

        const rest = new REST({ version: '9' }).setToken(token);
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: client.commands.map((command) => command.data.toJSON()) },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

async function registerEvents() {
    const eventDir = await fs.promises.readdir('./events')
    const eventFiles = eventDir.filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        console.log(`register event: ${event.name}`);

        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
    }
}

(async () => {
    await client.login(token)
    await registerEvents()
    await registerCommand()
    await registerCommands()
})()
