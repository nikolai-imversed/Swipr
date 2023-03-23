const { Client, GatewayIntentBits, Collection, Routes, REST } = require('discord.js');
const fs = require('node:fs');
const config = require('./config.js')


const token = config.DAVINCI_TOKEN
const clientId = "1088533676557606993"

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages
    ],
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`);
});

(async () => {
    await client.login(token)
    await registerEvents()
    await registerCommand()
    await registerCommands()
})()

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
    const rest = new REST({ version: '9' }).setToken(token);

    try {
        console.log('Started refreshing application (/) commands.');

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