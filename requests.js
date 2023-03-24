const fetch = require('node-fetch');
const config = require('./config.js')

async function imagine(prompt) {
    const payload = {
        type: 2,
        application_id: "936929561302675456",
        guild_id: config.SERVER_ID,
        channel_id: config.CHANNEL_ID,
        session_id: "2fb980f65e5c9a77c96ca01f2c242cf6",
        data: {
            version: "1077969938624553050",
            id: "938956540159881230",
            name: "imagine",
            type: 1,
            options: [
                {
                    type: 3,
                    name: "prompt",
                    value: prompt
                }
            ],
            application_command: {
                id: "938956540159881230",
                application_id: "936929561302675456",
                version: "1077969938624553050",
                default_permission: true,
                default_member_permissions: null,
                type: 1,
                nsfw: false,
                name: "imagine",
                description: "Create images with Midjourney",
                dm_permission: true,
                options: [
                    {
                        type: 3,
                        name: "prompt",
                        description: "The prompt to imagine",
                        required: true
                    }
                ]
            },
            attachments: []
        }
    };

    const myHeaders = new Headers()
    myHeaders.append("Authorization", config.SALAI_TOKEN);
    myHeaders.append("Content-Type", "application/json");

    const response = await fetch("https://discord.com/api/v9/interactions", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(payload),
    })
    return response;
}

exports.imagine = imagine