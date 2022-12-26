const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check to see if the bot is online.'),
	async execute(interaction, client) {
    const fetched = new EmbedBuilder()
    .setTitle('Pong!')
    .setDescription(`API Latency is ${Math.round(client.ws.ping)} ms.`)
    .setColor(0x0099FF)
    .setFooter({text: 'SWAT Automation', iconURL: process.env.image})
    .setTimestamp()
    
    await interaction.reply({ embeds: [fetched], ephemeral: true });
	},
};