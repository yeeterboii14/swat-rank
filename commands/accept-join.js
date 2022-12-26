const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js')
const roblox = require('noblox.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('accept-join')
		.setDescription('Accept a users join request.')
    .addStringOption(option =>
		option.setName('username')
			.setDescription('The roblox username of the user you want to accept into the group')
			.setRequired(true))
    .setDMPermission(false),
	async execute(interaction, client) {
        if(!interaction.member.roles.cache.some(role =>["Ranking Permissions"].includes(role.name))) return interaction.reply({ content: `You don't have permission to run this command.` , ephemeral: true})

        let username = interaction.options.getString('username');

    const invalidUserEmb = new EmbedBuilder()
    .setTitle('Invalid Username')
      .setDescription(`It appears ${username} is not a valid username. Please ensure their name is spelled correctly. `)
    .setColor(0x50C878)
          .setFooter({text: 'SWAT Automation', iconURL: process.env.image})
    .setTimestamp()

    let id;
    try {
        id = await roblox.getIdFromUsername(username);
    } catch {
        return interaction.reply({ embeds: [invalidUserEmb], ephemeral: true});
    }
    
    let acceptJoinResponse;
    try {
    acceptJoinRequestResponse = await roblox.handleJoinRequest(Number(process.env.groupId), id, true);
  } catch (err) {
        console.log('An error occured when running the accept-join command: ' + err);
        return interaction.reply({ content: `An error has occured ` + err, ephemeral: true});
    }
    

        const successEmbed = new EmbedBuilder()
    .setTitle('Success!')
      .setDescription(`I have succesfully accepted ${username} into the group.`)
    .setColor(0x50C878)
          .setFooter({text: 'SWAT Automation', iconURL: process.env.image})
    .setTimestamp()
    
    interaction.reply({ embeds: [successEmbed] });

    
	},
};