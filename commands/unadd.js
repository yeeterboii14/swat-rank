const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js')
const roblox = require('noblox.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unadd')
		.setDescription('Removes someone from the bot\'s friends.')
    .addStringOption(option =>
		option.setName('username')
			.setDescription('The roblox username of the user you want to unadd')
      .setRequired(true))
    .setDMPermission(false),
	async execute(interaction, client) {
    
    if(!interaction.member.roles.cache.some(role =>["Ranking Permissions"].includes(role.name))) return interaction.reply({ content: `You don't have permission to run this command.` , ephemeral: true})

  interaction.options.getString('username');
  
  let name = interaction.options.getString('username');

  let id = await roblox.getIdFromUsername(name)

  if(!id) return interaction.reply({ content: `Invalid ROBLOX User.` , ephemeral: true})

    let embed1 = new EmbedBuilder()

  try {
    await roblox.removeFriend(id)
    embed1.setTitle('Success!')
    embed1.setColor(0x50C878)
    embed1.setDescription(`I have succesfully unadded ${name}.`)
    embed1.setTimestamp()
    embed1.setFooter({text: 'SWAT Automation', iconURL: process.env.image})

    interaction.reply({embeds: [embed1], ephemeral: true})
  } catch {
        embed1.setTitle('An Error Has Occured')
    embed1.setColor(0xEE4B2B)
    embed1.setDescription(`There was an error while attempting to accept your friend request, check if you appropriately spelled your name right (or if you didn't supply one make sure your username in your Discord Display is correct).\n\nOr check to make sure that you actually send the friend request.`)
    embed1.setTimestamp()
    embed1.setFooter({text: 'SWAT Automation', iconURL: process.env.image})
    
    interaction.reply({embeds: [embed1], ephemeral: true})
	}
}
}