const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js')
const fs = require('fs')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loa')
		.setDescription('Submits a leave of absence request.')
    .addStringOption(option =>
		option.setName('start')
			.setDescription('The start date of your absence\n\nFormat: YYYY/MM/DD')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('end')
			.setDescription('The end date of your absence\n\nFormat: YYYY/MM/DD')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('reason')
			.setDescription('The reason of your absence')
			.setRequired(true))
    .setDMPermission(false),
	async execute(interaction, client) { 

    if(!interaction.member.roles.cache.some(role =>["Operative"].includes(role.name))) return interaction.reply({ content: `You don't have permission to run this command.` , ephemeral: true})

      
    let startDate = interaction.options.getString('start');
    let endDate = interaction.options.getString('end');
    let reason = interaction.options.getString('reason');

    let d = new Date(startDate)
    let d2 = new Date(endDate)

if (Object.prototype.toString.call(d) === "[object Date]") {
  if (isNaN(d.getTime())) {
          return interaction.reply({content: 'Invalid start date.\n\nPlease use the following format: YYYY/MM/DD', ephemeral: true})
  } else {
    // lol hi
  }
} else {
      return interaction.reply({content: 'Invalid start date object.\n\nPlease use the following format: YYYY/MM/DD', ephemeral: true})
}

    if (Object.prototype.toString.call(d2) === "[object Date]") {
  if (isNaN(d2.getTime())) {
          return interaction.reply({content: 'Invalid end date.\n\nPlease use the following format: YYYY/MM/DD', ephemeral: true})
  } else {
    // lol hi
  }
} else {
      return interaction.reply({content: 'Invalid end date object.\n\nPlease use the following format: YYYY/MM/DD', ephemeral: true})
}
    

    interaction.reply({content: 'Information recieved, your absence request should be sent to your respective supervisor.', ephemeral: true})

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('/');
}

    const changedDate1 = formatDate(d)
    const changedDate2 = formatDate(d2)
    const hoursDate = new Date()
    const changedDate = `${hoursDate.getHours()}:${hoursDate.getMinutes()} UTC ${changedDate1}`

    const disName = interaction.member.displayName
const splitName = disName.split(" ")
const userOnly = splitName[splitName.length - 1]

    let unit = ''
    let channelToSendTo = ''

        if(interaction.member.roles.cache.some(role =>["Squad A"].includes(role.name))) {
              unit = 'Squad A'
          channelToSendTo = client.channels.cache.get('981969323302219858')
        }
            if(interaction.member.roles.cache.some(role =>["Squad B"].includes(role.name))) {
              unit = 'Squad B'
              channelToSendTo = client.channels.cache.get('981969323302219858')
            }
                if(interaction.member.roles.cache.some(role =>["Squad C"].includes(role.name))) {
              unit = 'Squad C'
              channelToSendTo = client.channels.cache.get('981969323302219858')
            }
            if(interaction.member.roles.cache.some(role =>["Squad D"].includes(role.name))) {
              unit = 'Squad D'
              channelToSendTo = client.channels.cache.get('981969323302219858')
            }

                if(interaction.member.roles.cache.some(role =>["Command", "Senior Command", "Administration"].includes(role.name))) {
              unit = 'Command'
              channelToSendTo = client.channels.cache.get('981969323302219858')
            }


const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`loa_accept`)
					.setLabel('Accept')
					.setStyle(ButtonStyle.Success),
        	new ButtonBuilder()
					.setCustomId('loa_deny')
					.setLabel('Deny')
					.setStyle(ButtonStyle.Danger),
			);

    const relativeDate =  Math.floor(d.getTime()/1000.0)
    const relativeDate2 = Math.floor(d2.getTime()/1000.0)
    
const date1 = new Date(d);
const date2 = new Date(d2);
const diffTime = Math.abs(date2 - date1);
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let channelSendEmbed = new EmbedBuilder()
	.setTitle(`${unit} Leave of Absence Submission`)
      .setDescription('All leave of absences are set to begin at midnight, UTC.')
	.setAuthor({ name: `${interaction.member.displayName} | ${interaction.member.id}`})
	.addFields(
		{ name: 'Start Date', value: `<t:${relativeDate}:D> (<t:${relativeDate}:R>)` },
		{ name: 'End Date', value: `<t:${relativeDate2}:D> (<t:${relativeDate2}:R>)` },
		{ name: 'Reason', value: `${reason}` },
		{ name: 'Duration', value: `${diffDays} days` },
	)
	.setTimestamp()
	.setFooter({ text: 'SWAT Automation', iconURL: process.env.image });

    channelToSendTo.send({ content: `Submitted at ${changedDate}`, components: [row], embeds: [channelSendEmbed]})
    
    const fetched = new EmbedBuilder()
    .setTitle('Leave of Absence Submission')
    .setDescription(`Your absence request has been succesfully submitted to your respective supervisor.`)
    .setColor(0x0099FF)
    .setFooter({text: 'SWAT Automation', iconURL: process.env.image})
    .setTimestamp()
    
   await interaction.member.send({ embeds: [fetched] });

    unit = ''
    channelToSendTo = ''
	},
};