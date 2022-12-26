const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js')
const roblox = require('noblox.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shout')
		.setDescription('Shout a message to the group.')
    .addStringOption(option =>
		option.setName('message')
			.setDescription('The message you want to be shouted.')
			.setRequired(true))
    .setDMPermission(false),
	async execute(interaction, client) {
        if(!interaction.member.roles.cache.some(role =>["Ranking Permissions"].includes(role.name))) return interaction.reply({ content: `You don't have permission to run this command.` , ephemeral: true})

        let message = interaction.options.getString('message');

    let shoutResponse;
    try {
        shoutResponse = await roblox.shout(Number(process.env.groupId), message);
    } catch (err) {
        console.log('An error occured when running the shout command: ' + err);
        return interaction.reply({ content: `An error has occured ` + err, ephemeral: true});
    }

        const successEmbed = new EmbedBuilder()
    .setTitle('Success!')
      .setDescription(`I have succesfully posted \`${message}.\``)
    .setColor(0x50C878)
          .setFooter({text: 'SWAT Automation', iconURL: process.env.image})
    .setTimestamp()
    
    interaction.reply({ embeds: [successEmbed] });
	},
};