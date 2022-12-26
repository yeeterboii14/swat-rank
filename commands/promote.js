const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js')
const roblox = require('noblox.js')

async function getRankName(func_group, func_user){
    let rolename = await roblox.getRankNameInGroup(func_group, func_user);
    return rolename;
}

async function getRankID(func_group, func_user){
    let role = await roblox.getRankInGroup(func_group, func_user);
    return role;
}

async function getRankFromName(func_rankname, func_group){
    let roles = await roblox.getRoles(func_group);
    let role = await roles.find(rank => rank.name == func_rankname);
    if(!role){
        return 'NOT_FOUND';
    }
    return role.rank;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('promote')
		.setDescription('Promote a user one rank.')
    .addStringOption(option =>
		option.setName('username')
			.setDescription('The roblox username of the user you want to promote')
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

        const notAbleRankEmb = new EmbedBuilder()
    .setTitle('Oops an error has occured')
      .setDescription(`I cannot rank this individual any higher due to bot permissions.`)
    .setColor(0x50C878)
          .setFooter({text: 'SWAT Automation', iconURL: process.env.image})
    .setTimestamp()
    
    let rankInGroup = await getRankID(Number(process.env.groupId), id);
    let rankNameInGroup = await getRankName(Number(process.env.groupId), id);
    if(Number(process.env.maximumRank) <= rankInGroup || Number(process.env.maximumRank) <= rankInGroup + 1){
        return interaction.reply({ embeds: [notAbleRankEmb], ephemeral: true});
    }
    let promoteResponse;
    try {
        promoteResponse = await roblox.promote(Number(process.env.groupId), id);
    } catch (err) {
        console.log('An error occured when running the promote command: ' + err);
        return interaction.reply({ content: `An error has occured ` + err, ephemeral: true});
    }
    let newRankName = await getRankName(Number(process.env.groupId), id);
    let newRank = await getRankID(Number(process.env.groupId), id);
    

        const successEmbed = new EmbedBuilder()
    .setTitle('Success!')
      .setDescription(`I have succesfully ranked ${username} to ${promoteResponse.newRole.name}, from ${rankNameInGroup}`)
    .setColor(0x50C878)
          .setFooter({text: 'SWAT Automation', iconURL: process.env.image})
    .setTimestamp()
    
    interaction.reply({ embeds: [successEmbed] });
	},
};