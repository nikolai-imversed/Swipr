const { Client, GatewayIntentBits, Collection, Routes, REST } = require('discord.js');
const fs = require('node:fs');

const token = "MTA4NzY3OTk4OTE4NjU2NDE2Ng.Gm37Sf.2Zh7Ss8rI-dpQiO7JGLCwOqrMYcFlYfAgmY_ew"
const clientId = "1087679989186564166"

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
})()

function registerCommand() {
    client.commands = new Collection();
    const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        console.log(`register command: ${command.data.name}`);

        client.commands.set(command.data.name, command);
    }
}

function registerEvents() {
    const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

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

async function registerCommands() {
    const guildsCollection = client.guilds.cache;
    const guilds = [...guildsCollection].map(([_, value]) => value);

    const commands = [];
    const commandFiles = fs.readdirSync(`./commands`).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }

    for (const guild of guilds) {
        const rest = new REST({ version: '10' }).setToken(token);

        await rest
            .put(Routes.applicationGuildCommands(clientId, guild.id), { body: commands })
            .then(() => console.log('Successfully registered application commands to', guild.id))
            .catch(console.error);
    }
};