import { Client, GatewayIntentBits, Collection, Events, REST, Routes } from 'discord.js'
import * as fs from 'fs'
import * as path from 'path'

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
    await client.login("MTA4NzY3OTk4OTE4NjU2NDE2Ng.Gm37Sf.2Zh7Ss8rI-dpQiO7JGLCwOqrMYcFlYfAgmY_ew")
    registerCommand()
})()





async function registerCommand() {
    const commands = [];
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    console.log(commandsPath)
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }
    
    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: '10' }).setToken("MTA4NzY3OTk4OTE4NjU2NDE2Ng.Gm37Sf.2Zh7Ss8rI-dpQiO7JGLCwOqrMYcFlYfAgmY_ew");
    
    // and deploy your commands!
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationGuildCommands("1087679989186564166", "1087675589290369057"),
                { body: commands },
            );
    
            console.log(`Successfully reloaded ${data} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    
}

registerCommand()