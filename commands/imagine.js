const { SlashCommandBuilder } = require("discord.js")
const { imagine } = require("../requests.js")
const config = require('../config.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('imagine')
        .setDescription('Ask Midjourney to generate image')
        .addStringOption((option) => option.setName('prompt').setDescription('Ruslan eating apple pie').setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true });
        try {
            const prompt = await interaction.options.getString('prompt');
            if (config.USE_MESSAGED_CHANNEL) {
                config.CHANNEL_ID = interaction.channel.id;
            }
            const response = await imagine(prompt)
            if (response.status >= 400) {
                console.error(response.status)
               return await interaction.editReply('Request has failed; please try later')
            } else {
                await interaction.editReply('Your image is being prepared, please wait a moment...')
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply(error.message);
        }
        await interaction.editReply({ephemeral: true });
    },
};
