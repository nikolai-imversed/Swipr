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
            const prompt = interaction.options.getString('prompt');
            if (config.USE_MESSAGED_CHANNEL) {
                config.CHANNEL_ID = interaction.channel.id;
            }
            const response = await imagine(prompt)
            console.log(response)
            if (response.status >= 400) {
                console.error(response.status)
               await interaction.editReply({ content: 'Request has failed; please try later', ephemeral: true })
            } else {
                await interaction.editReply({ content: 'Your image is being prepared, please wait a moment...', ephemeral: true })
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: error.message, ephemeral: true });
        }
    },
};
