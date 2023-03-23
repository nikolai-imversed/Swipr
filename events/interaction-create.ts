import { Events } from 'discord.js';

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(client, interaction) {
        if (!interaction.isCommand()) return;

        try {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};
