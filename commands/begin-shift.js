const roblox = require('noblox.js')
const Discord = require('discord.js')
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require ('axios')
let startTime;
let UserId;
let dscId;
  let activeInGame;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('begin-shift')
		.setDescription('Begin an automated shift.'),
	async execute(interaction, client) {
        if(!interaction.member.roles.cache.some(role =>["Operative"].includes(role.name))) return interaction.reply({ content: `You don't have permission to run this command.` , ephemeral: true})

    const disName = interaction.member.displayName
  const splitName = disName.split(" ")
  userOnly = splitName[splitName.length - 1]
  const callsign = splitName[0]

  UserId = await roblox.getIdFromUsername(userOnly)
    dscId = interaction.member.id;

  if(!UserId) {
    const noIDEmbed = new EmbedBuilder()
    .setTitle('An Error Has Occured')
    .setDescription('There was an error while attempting to get your user ID. Please ensure the username that is in your Discord Display Name is up to date, and spelled correctly. If it is correctly spelled, please alert yeeterboii14#5954.')
    .setColor(0xEE4B2B)
    .setTimestamp()
          .setFooter({text: 'SWAT Automation', iconURL: process.env.image})
    
    return interaction.reply({ embeds: [noIDEmbed], ephemeral: true})  
  }

  
    
  setInterval(()=>{
    if(activeInGame === true){
    checkPlayer(UserId, client, interaction)
    }
  }, 60 * 1000);
  
  let ingame = false;

await axios.get('https://games.roblox.com/v1/games/4793176968/servers/Friend?limit=100', { headers: { Cookie: ".ROBLOSECURITY=" + process.env.cookie } })
      .then(async (res) => {
        await res.data.data.forEach(async (data) => {
          await data.players.forEach(async (player) => {
            if (player.id === UserId) {
              ingame = true
              activeInGame = true
            }
          })
        })
      })
      .catch(error => {
        
      })

      if(ingame === false) {
    const notInGameEmbed = new EmbedBuilder()
    .setTitle('An Error Has Occured')
    .setDescription('I was unable to find you in game!\n\nPlease ensure that you are in game, and added to the SWAT Bot! Or ensure your privacy settings are correctly set.')
    .setColor(0xEE4B2B)
        .setTimestamp()
          .setFooter({text: 'SWAT Automation', iconURL: process.env.image})
        
    return interaction.reply({ embeds: [notInGameEmbed], ephemeral: true})
  }
      if(ingame === true) {



    startTime = new Date()

        
    
    const startShiftEmbed = new EmbedBuilder()
    .setTitle('The Shift Has Started')
    .setDescription(`I have successfully located you in game, and started your shift at ${new Date().toLocaleTimeString()} UTC!\n\nYour shift should automatically end when you leave the game, if it doesn't please make sure you have proof to send to your supervisor.`)
        .setColor(0x50C878)
        .setTimestamp()
          .setFooter({text: 'SWAT Automation', iconURL: process.env.image})

    interaction.reply({embeds: [startShiftEmbed]})
      }
	},
};

async function checkPlayer(UserId, client, interaction) {
  const UserID2 = UserId;

  let allowedPlayers = new Array()
    
    await axios.get('https://games.roblox.com/v1/games/4793176968/servers/Friend?limit=100', { headers: { Cookie: ".ROBLOSECURITY=" + process.env.cookie } })
      .then(async (res) => {
        await res.data.data.forEach(async (data) => {
          await data.players.forEach(async (player) => {
            if (player.id === UserID2) {
              await allowedPlayers.push(String(UserID2))
              
            }
          })
        })
      })
      .catch(error => {
        // error stuff
      })

  console.log(allowedPlayers)

  
    if(await allowedPlayers.includes(String(UserID2))) {
      activeInGame = true;
    } else {

      activeInGame = false;
      let foundUser = await interaction.guild.members.fetch(dscId)
      let unit;
      let channelToSendTo;
            const startRealDate = startTime;
      let endTime = new Date();
      const endRealDate = new Date();
      let startMinutes = startRealDate.getMinutes();
      if(startMinutes.length < 2) startMinutes = '0' + startMinutes;
      let startHours = startRealDate.getHours();
      if(startHours.length < 2) startHours = '0' + startHours;
      let startMonth = startRealDate.getMonth();
      if(startMonth.length < 2) startMonth = '0' + startMonth;
      let startDate = startRealDate.getDate();
      if(startDate.length < 2) startDate = '0' + startDate;
      
      let endMinutes = endRealDate.getMinutes();
      if(endMinutes.length < 2) endMinutes = '0' + endMinutes;
      let endHours = endRealDate.getHours();
      if(endHours.length < 2) endHours = '0' + endHours;
      let endMonths = endRealDate.getMonth();
      if(endMonths.length < 2) endMonths = '0' + endMonths;
      let endDate = endRealDate.getDate();
      if(endDate.length < 2) endDate = '0' + endDate;
      
      const convertedStart = endRealDate.getFullYear() + "/" + startMonth + "/" + startDate + " " + startHours + ":" + startMinutes;
      
            const convertedEnd = endRealDate.getFullYear() + "/" + endMonths + "/" + endDate + " " + endHours + ":" + endMinutes;

var diff = Math.abs(new Date(convertedEnd) - new Date(convertedStart));
      const totalMins = Math.floor((diff/1000)/60);
      
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

    const disName = foundUser.displayName
const splitName = disName.split(" ")
const userOnly = splitName[splitName.length - 1]

        if(foundUser.roles.cache.some(role =>["Squad A"].includes(role.name))) {
              unit = 'Squad A'
          channelToSendTo = client.channels.cache.get('969013059978932294')
        }
            if(foundUser.roles.cache.some(role =>["Squad B"].includes(role.name))) {
              unit = 'Squad B'
              channelToSendTo = client.channels.cache.get('969013059978932294')
            }
                if(foundUser.roles.cache.some(role =>["Squad C"].includes(role.name))) {
              unit = 'Squad C'
              channelToSendTo = client.channels.cache.get('969012987505569862')
            }
            if(foundUser.roles.cache.some(role =>["Squad D"].includes(role.name))) {
              unit = 'Squad D'
              channelToSendTo = client.channels.cache.get('969012987505569862')
            }

                if(foundUser.roles.cache.some(role =>["Command", "Senior Command", "Administration"].includes(role.name))) {
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
      "start" : `${startTime.toLocaleTimeString()}`,
      "end" : `${endTime.toLocaleTimeString()}`,
      "length" : `${totalMins} minutes`,
      "evidence" : `Automated Log`,
      "dateSubmitted" : `${changedDate}`
    }

    let channelSendEmbed = new EmbedBuilder()
	.setTitle(`${unit} Automated Patrol Submission`)
	.setAuthor({ name: `${foundUser.displayName} | ${foundUser.id}`})
	.addFields(
		{ name: 'Start Time', value: `${startTime.toLocaleTimeString()}` },
		{ name: 'End Time', value: `${endTime.toLocaleTimeString()}` },
		{ name: 'Total Time', value: `${totalMins}` },
		{ name: 'Evidence', value: `Automated Submission` },
	)
	.setTimestamp()
	.setFooter({ text: 'SWAT Automation', iconURL: process.env.image });

    channelToSendTo.send({ content: `Submitted at ${changedDate}`, components: [row], embeds: [channelSendEmbed]})
    
    const fetched = new EmbedBuilder()
    .setTitle('Patrol Log Submission')
    .setDescription(`Your patrol log lasting ${totalMins} minutes has been submitted to your supervisor.`)
    .setColor(0x0099FF)
    .setFooter({text: 'SWAT Automation', iconURL: process.env.image})
    .setTimestamp()
    
   await foundUser.send({ embeds: [fetched] });

    unit = ''
    channelToSendTo = ''
    }
  }