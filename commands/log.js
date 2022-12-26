const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js')
const fs = require('fs')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('log')
		.setDescription('Submits a patrol log.')
    .addStringOption(option =>
		option.setName('start')
			.setDescription('The start time of your patrol')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('end')
			.setDescription('The end time of your patrol')
			.setRequired(true))
  	.addIntegerOption(option =>
		option.setName('time')
			.setDescription('The total time of your patrol')
			.setRequired(true)
      .setMinValue(30))  
	.addStringOption(option =>
		option.setName('evidence')
			.setDescription('The evidence of your patrol')
			.setRequired(true))
    .setDMPermission(false),
	async execute(interaction, client) { 

    if(!interaction.member.roles.cache.some(role =>["Operative"].includes(role.name))) return interaction.reply({ content: `You don't have permission to run this command.` , ephemeral: true})

    interaction.reply({content: 'Information recieved, your patrol should be sent to your supervisor. You will recieve a dm when it is done.', ephemeral: true})
    
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

    const changedDate1 = formatDate(new Date())
    const hoursDate = new Date()
    const changedDate = `${hoursDate.getHours()}:${hoursDate.getMinutes()} UTC ${changedDate1}`
  
    let startTime = interaction.options.getString('start');
    let endTime = interaction.options.getString('end');
    let totalTime = interaction.options.getInteger('time');
    let evidence = interaction.options.getString('evidence');

    const disName = interaction.member.displayName
const splitName = disName.split(" ")
const userOnly = splitName[splitName.length - 1]

    let unit = ''
    let channelToSendTo = ''

        if(interaction.member.roles.cache.some(role =>["Squad A"].includes(role.name))) {
              unit = 'Squad A'
          channelToSendTo = client.channels.cache.get('969013059978932294')
        }
            if(interaction.member.roles.cache.some(role =>["Squad B"].includes(role.name))) {
              unit = 'Squad B'
              channelToSendTo = client.channels.cache.get('969013059978932294')
            }
                if(interaction.member.roles.cache.some(role =>["Squad C"].includes(role.name))) {
              unit = 'Squad C'
              channelToSendTo = client.channels.cache.get('969012987505569862')
            }
            if(interaction.member.roles.cache.some(role =>["Squad D"].includes(role.name))) {
              unit = 'Squad D'
              channelToSendTo = client.channels.cache.get('969012987505569862')
            }

                if(interaction.member.roles.cache.some(role =>["Command", "Senior Command", "Administration"].includes(role.name))) {
              unit = 'Command'
              channelToSendTo = client.channels.cache.get('975460206689542264')
            }


const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`accept`)
					.setLabel('Accept')
					.setStyle(ButtonStyle.Success),
        	new ButtonBuilder()
					.setCustomId('deny')
					.setLabel('Deny')
					.setStyle(ButtonStyle.Danger),
			);

    const dataToString = {
      "username" : `${userOnly}`,
      "start" : `${startTime}`,
      "end" : `${endTime}`,
      "length" : `${totalTime} minutes`,
      "evidence" : `${evidence}`,
      "dateSubmitted" : `${changedDate}`
    }

    const stringifiedData = JSON.stringify(dataToString);
    fs.writeFile(`./patrols/${userOnly}.json`, stringifiedData, (err) => {
      if(err) { console.log(err) }
});


    let channelSendEmbed = new EmbedBuilder()
	.setTitle(`${unit} Patrol Submission`)
	.setAuthor({ name: `${interaction.member.displayName} | ${interaction.member.id}`})
	.addFields(
		{ name: 'Start Time', value: `${startTime}` },
		{ name: 'End Time', value: `${endTime}` },
		{ name: 'Total Time', value: `${totalTime}` },
		{ name: 'Evidence', value: `${evidence}` },
	)
	.setTimestamp()
	.setFooter({ text: 'SWAT Automation', iconURL: process.env.image });

    channelToSendTo.send({ content: `Submitted at ${changedDate}`, components: [row], embeds: [channelSendEmbed]})
    
    const fetched = new EmbedBuilder()
    .setTitle('Patrol Log Submission')
    .setDescription(`Your patrol log has been succesfully submitted to your respective supervisor.`)
    .setColor(0x0099FF)
    .setFooter({text: 'SWAT Automation', iconURL: process.env.image})
    .setTimestamp()
    
   await interaction.member.send({ embeds: [fetched] });

    unit = ''
    channelToSendTo = ''
	},
};