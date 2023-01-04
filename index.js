const express = require('express');
const app = express();

app.get('/', (request, response) => {
     response.sendStatus(200);
});

let listener = app.listen(process.env.PORT, () => {
     console.log('Your app is currently listening on port: ' + listener.address().port);
});

const wait = require('node:timers/promises').setTimeout;
const { Client, Events, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const Discord = require('discord.js')
const fs = require('node:fs');
const path = require('node:path');
let foundUser = ''
const Trello = require('trello')
const trello = new Trello(process.env.APIKey, process.env.APIToken)
const fetch = require('node-fetch');
const roblox = require('noblox.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once(Events.ClientReady, () => {
	console.log('Bot Started\n-----');
  require(`./deploy-commands.js`)
});

roblox.setCookie(process.env.cookie).catch(async err => {
    console.log(chalk.red('Issue with logging in: ' + err));
});


// slash handler
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// button handler
client.on(Events.InteractionCreate, async interaction => {

  let startTime = ''
  let endTime = ''
  let totalTime = ''
  let evidence = ''

  let startDate = ''
  let endDate = ''
  let duration = ''
  let reason = ''
  
  	if (!interaction.isButton()) return;
  if(interaction.isStringSelectMenu()) console.log(interaction)

  if(!interaction.member.roles.cache.some(role =>["Command", "Senior Command", "Administration"].includes(role.name))) {
    return interaction.reply({content: 'You are not authorized to approve patrol logs.', ephemeral: true})
  } else {
    if(interaction.customId === 'accept') { 
      
      interaction.message.embeds.forEach( async (embed) => {
        embed.fields.forEach((field) => {
          if(field.name === 'Start Time') {
            startTime = field.value;
          } else if(field.name === 'End Time') {
            endTime = field.value;
          } else if(field.name === 'Total Time') {
            totalTime = field.value;
          } else if (field.name === 'Evidence') {
            evidence = field.value;
          }
        })
        const authorArgs = embed.author.name.split(" ")
        foundUser = await interaction.guild.members.fetch(authorArgs[authorArgs.length - 1])
      })

      await wait(2000)

      

        const disName = foundUser.displayName
  const splitName = disName.split(" ")
  const userOnly = splitName[splitName.length - 1]
      const callsign = splitName[0]
      let rank = ''

          let cardsOnBoard = await trello.getCardsOnBoard(process.env.BoardID)

    
let targetCard

let cardID    

await cardsOnBoard.forEach(async function (item) {
  if(item.idList === '607f10f13026e61f542aac58') return;
    const splitCardName = item.name.split(" ")
    const lastWordOfCardName = splitCardName[splitCardName.length - 1]
    
    if (lastWordOfCardName.toLowerCase() === userOnly.toLowerCase()) {
        targetCard = item
    }
})


      let unit;

                    if(foundUser.roles.cache.some(role =>["Private"].includes(role.name))) rank = 'Private'
                          if(foundUser.roles.cache.some(role =>["Private First Class"].includes(role.name))) rank = 'Private First Class'
                    if(foundUser.roles.cache.some(role =>["Corporal"].includes(role.name))) rank = 'Corporal'
                    if(foundUser.roles.cache.some(role =>["Sergeant"].includes(role.name))) rank = 'Sergeant'
                    if(foundUser.roles.cache.some(role =>["Lieutenant"].includes(role.name))) rank = 'Lieutenant'
                    if(foundUser.roles.cache.some(role =>["Captain"].includes(role.name))) rank = 'Captain'
                    if(foundUser.roles.cache.some(role =>["Major"].includes(role.name))) rank = 'Major'
                      if(foundUser.roles.cache.some(role =>["Commander"].includes(role.name))) rank = 'Commander'
                          if(foundUser.roles.cache.some(role =>["Executive Officer"].includes(role.name))) rank = 'Executive Officer'
                          if(foundUser.roles.cache.some(role =>["Commanding Officer"].includes(role.name))) rank = 'Commanding Officer'




                          if(foundUser.roles.cache.some(role =>["Squad A"].includes(role.name))) unit = 'Squad A'
                    if(foundUser.roles.cache.some(role =>["Squad B"].includes(role.name))) unit = 'Squad B'
                    if(foundUser.roles.cache.some(role =>["Squad C"].includes(role.name))) unit = 'Squad C'
                    if(foundUser.roles.cache.some(role =>["Squad D"].includes(role.name))) unit = 'Squad D'
                    if(foundUser.roles.cache.some(role =>["Senior Command"].includes(role.name))) unit = 'Senior Command'
                    if(foundUser.roles.cache.some(role =>["Administration"].includes(role.name))) unit = 'Administration'

      if(rank === '') rank = 'Unknown'


if (!targetCard) {

      let channelSendEmbed5 = new EmbedBuilder()
	.setTitle(`Oops! An error has occured`)
        .setAuthor({ name: `${rank} ${userOnly} | ${foundUser.id} | ${unit}`})
  .setDescription(`${userOnly}'s trello card could not be located on either database.\n\nPlease ensure their display name is the same as their trello card. It is NOT case sensitive.`)
	.setTimestamp()
	.setFooter({ text: 'SWAT Automation', iconURL: process.env.image });

  interaction.message.edit({ content: `Unable to locate card`, components: [] })
   return interaction.channel.send({ content: ``, components: [], embeds: [channelSendEmbed5]})
} else {
  cardID = targetCard.id
}

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
    const changedDate = `${changedDate1}`



    const newCardFormat = `**MCSO:SWAT PATROL LOG**\n________________________________________________________________________\n**NAME:**\n> ${userOnly} \n\n**RANK:**\n > ${rank}\n\n**CALLSIGN:**\n > ${callsign}\n\n**DATE OF PATROL:**\n > ${changedDate}\n\n**START TIME:**\n > ${startTime}\n\n**END TIME:**\n > ${endTime}\n\n**TOTAL TIME:**\n > ${totalTime} minutes \n\n **SCREENSHOTS:**\n > ${evidence}\n\n**SUPERVISOR SIGNATURE:**\n > ${interaction.member.displayName}\n`

    trello.addCommentToCard(cardID, newCardFormat)

      let fieldOnCard = await trello.getCustomFieldsOnCard(cardID)

let patrolField
    
    
await fieldOnCard.forEach(async function (item) {
    const fieldName = item.idCustomField
    
    if (fieldName === "609c721dd4b0de0900cf9aea") {
        patrolField = item
    }
})    

      let patrolFieldVal = patrolField.value.number;
    if(!patrolField.value.number) logFieldVal = '0'
    
    trello.setCustomFieldOnCard(cardID, '609c721dd4b0de0900cf9aea', {value: { "number": Number(totalTime) + Number(patrolField.value.number)}})

    let logField
    let plusLog = '1'
    
await fieldOnCard.forEach(async function (item) {
    const fieldName = item.idCustomField
    
    if (fieldName === "6070f9cfc647d25d7f4f07e5") {
        logField = item
    }
})

    let logFieldVal = logField.value.number;
    if(!logField.value.number) logFieldVal = '0'
    
    trello.setCustomFieldOnCard(cardID, '6070f9cfc647d25d7f4f07e5', {value: { "number": Number(logFieldVal) + Number(plusLog)}})

    await fieldOnCard.forEach(async function (item) {
    const fieldName = item.idCustomField
    
    if (fieldName === "609c721dd4b0de0900cf9aea") {
        patrolField = item
    }
})    

      try {
        fs.unlink(`./patrols/${userOnly}.json`, function (err, success) {
          
        })
      } catch (err) {
        console.log('there was an error ' + err)
      }

      const embed1 = new EmbedBuilder()
      .setTitle('Patrol Accepted')
      .setDescription(`Your patrol lasting ${totalTime} minutes has been accepted.\n\nBringing your total patrol time this week up to **${Number(totalTime) + Number(patrolField.value.number)} minutes.**`)
    .setColor(0x50C878)
          .setFooter({text: 'SWAT Automation', iconURL: process.env.image})
    .setTimestamp()

      foundUser.send({ embeds: [embed1] })
      interaction.message.edit({content: `Patrol accepted by ${interaction.member.displayName}.`, components: [] })
    }
    if(interaction.customId === 'deny') {      
            interaction.message.embeds.forEach( async (embed) => {
        embed.fields.forEach((field) => {
          if(field.name === 'Start Time') {
            startTime = field.value;
          } else if(field.name === 'End Time') {
            endTime = field.value;
          } else if(field.name === 'Total Time') {
            totalTime = field.value;
          } else if (field.name === 'Evidence') {
            evidence = field.value;
          }
        })
        const authorArgs = embed.author.name.split(" ")
        foundUser = await interaction.guild.members.fetch(authorArgs[authorArgs.length - 1])
      })

      await wait(2000)
      
      let disName = foundUser.displayName
let splitName = disName.split(" ")
let userOnly = splitName[splitName.length - 1]

    const dropdownMenu = new Discord.ActionRowBuilder()
			.addComponents(
				new Discord.StringSelectMenuBuilder()
					.setCustomId('deny-selection')
					.setPlaceholder('Nothing selected')
					.addOptions(
						{
							label: 'Invalid Proof',
							description: 'The patrol proof is invalid.',
							value: 'first_option',
						},
						{
							label: 'Patrol is too short',
							description: 'The patrol didn\'t meet the minimum log requirmenet',
							value: 'second_option',
						},
            {
							label: 'Too many logs submitted',
							description: 'The officer submitted too many logs in a day, surpassing the limit.',
							value: 'third_option',
						},
            {
							label: 'Not Disclosed Reason',
							description: 'The reason of their patrol being denied will not be disclosed with them.',
							value: 'fourth_option',
						},
            {
							label: 'Other',
							description: 'The reason of their patrol being denied is not on this list.',
							value: 'fifth_option',
						},
					),
			);

      
      const channelDeniedEmbed = new EmbedBuilder()
      .setTitle('Denied Log')
      .setDescription('Please select the reason you denied their log on the dropdown menu below.')
      .setTimestamp()
      .setFooter({text: 'SWAT Automation', iconURL: process.env.image}) 

      // embeds: [channelDeniedEmbed],
      // components: [dropdownMenu],

      try {
        fs.unlink(`./patrols/${userOnly}.json`, function (err, success) {
          
        })
      } catch (err) {
        console.log('there was an error ' + err)
      }

      interaction.reply({ content: `${foundUser.id}`, embeds: [channelDeniedEmbed], components: [dropdownMenu], ephemeral: true})
      interaction.message.edit({content: `Patrol denied by ${interaction.member.displayName}.`, components: [] })
    }
    if(interaction.customId === 'loa_accept') {
      interaction.message.embeds.forEach( async (embed) => {
        embed.fields.forEach((field) => {
          if(field.name === 'Start Date') {
            startDate = field.value;
          } else if(field.name === 'End Date') {
            endDate = field.value;
          } else if(field.name === 'Reason') {
            reason = field.value;
          } else if (field.name === 'Duration') {
            duration = field.value;
          }
        })
        const authorArgs = embed.author.name.split(" ")
        foundUser = await interaction.guild.members.fetch(authorArgs[authorArgs.length - 1])
      })

      await wait(2000)

      

        const disName = foundUser.displayName
  const splitName = disName.split(" ")
  const userOnly = splitName[splitName.length - 1]
      const callsign = splitName[0]
      let rank = ''

          let cardsOnBoard = await trello.getCardsOnBoard(process.env.BoardID)

    
let targetCard

let cardID    

await cardsOnBoard.forEach(async function (item) {
    const splitCardName = item.name.split(" ")
    const lastWordOfCardName = splitCardName[splitCardName.length - 1]
    
    if (lastWordOfCardName.toLowerCase() === userOnly.toLowerCase()) {
        targetCard = item
    }
})

      let unit;

                    if(foundUser.roles.cache.some(role =>["Private"].includes(role.name))) rank = 'Private'
                                if(foundUser.roles.cache.some(role =>["Private First Class"].includes(role.name))) rank = 'Private First Class'
                    if(foundUser.roles.cache.some(role =>["Corporal"].includes(role.name))) rank = 'Corporal'
                    if(foundUser.roles.cache.some(role =>["Sergeant"].includes(role.name))) rank = 'Sergeant'
                    if(foundUser.roles.cache.some(role =>["Lieutenant"].includes(role.name))) rank = 'Lieutenant'
                    if(foundUser.roles.cache.some(role =>["Captain"].includes(role.name))) rank = 'Captain'
                    if(foundUser.roles.cache.some(role =>["Major"].includes(role.name))) rank = 'Major'
                      if(foundUser.roles.cache.some(role =>["Commander"].includes(role.name))) rank = 'Commander'
                          if(foundUser.roles.cache.some(role =>["Executive Officer"].includes(role.name))) rank = 'Executive Officer'
                          if(foundUser.roles.cache.some(role =>["Commanding Officer"].includes(role.name))) rank = 'Commanding Officer'




                          if(foundUser.roles.cache.some(role =>["Squad A"].includes(role.name))) unit = 'Squad A'
                    if(foundUser.roles.cache.some(role =>["Squad B"].includes(role.name))) unit = 'Squad B'
                    if(foundUser.roles.cache.some(role =>["Squad C"].includes(role.name))) unit = 'Squad C'
                    if(foundUser.roles.cache.some(role =>["Squad D"].includes(role.name))) unit = 'Squad D'
                    if(foundUser.roles.cache.some(role =>["Senior Command"].includes(role.name))) unit = 'Senior Command'
                    if(foundUser.roles.cache.some(role =>["Administration"].includes(role.name))) unit = 'Administration'

      if(rank === '') rank = 'Unknown'


if (!targetCard) {

      let channelSendEmbed5 = new EmbedBuilder()
	.setTitle(`Oops! An error has occured`)
        .setAuthor({ name: `${rank} ${userOnly} | ${foundUser.id} | ${unit}`})
  .setDescription(`${userOnly}'s trello card could not be located on either database.\n\nPlease ensure their display name is the same as their trello card. It is NOT case sensitive.`)
	.setTimestamp()
	.setFooter({ text: 'SWAT Automation', iconURL: process.env.image });

  interaction.message.edit({ content: `Unable to locate card`, components: [] })
   return interaction.channel.send({ content: ``, components: [], embeds: [channelSendEmbed5]})
} else {
  cardID = targetCard.id
}

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

    const startDateEpochArgs = startDate.split(':')
    const dateToTranslate = startDateEpochArgs[1]

      const d4 = new Date(0)
      d4.setUTCSeconds(dateToTranslate);

          const endDateEpochArgs = endDate.split(':')
    const dateToTranslate2 = endDateEpochArgs[1]

      const d5 = new Date(0)
      d5.setUTCSeconds(dateToTranslate2);

      let actualDate1 = ''
      let actualDate2 = ''

      actualDate1 = formatDate(d4)
      actualDate2 = formatDate(d5)
      


    const changedDate1 = formatDate(new Date())
    const changedDate = `${changedDate1}`

      let commentToAdd = `**MCSO:SWAT LEAVE OF ABSENCE**\n________________________________________________________________________\n**NAME:**\n> ${userOnly} \n\n**RANK:**\n > ${rank}\n\n**CALLSIGN:**\n > ${callsign}\n\n**DATE OF APPROVAL:**\n > ${changedDate}\n\n**START DATE:**\n > ${actualDate1}\n\n**END DATE:**\n > ${actualDate2}\n\n**TOTAL DURATION:**\n > ${duration} \n\n **SUPERVISOR SIGNATURE:**\n > ${interaction.member.displayName}\n`

      trello.addCommentToCard(cardID, commentToAdd)

      const date88 = new Date(d4)
      const date89 = new Date(d5)

      fetch(`https://api.trello.com/1/cards/${cardID}?key=${process.env.APIKey}&token=${process.env.APIToken}&start=${date88}&due=${date89}`, {
  method: 'PUT',
  headers: {
    'Accept': 'application/json'
  }
})

      const embed1 = new EmbedBuilder()
      .setTitle('LOA Accepted')
      .setDescription(`Your Leave of Absence beginning on <t:${dateToTranslate}:f>, and ending on <t:${dateToTranslate2}:f>, has been accepted.\n\nWhich is a total of ${duration} off.`)
    .setColor(0x50C878)
          .setFooter({text: 'SWAT Automation', iconURL: process.env.image})
    .setTimestamp()

      const role = interaction.guild.roles.cache.find(role => role.id == "861000811033919498");

      foundUser.roles.add(role)
      foundUser.send({ embeds: [embed1] })
      interaction.message.edit({content: `LOA accepted by ${interaction.member.displayName}.`, components: [] })
      
    }
    if(interaction.customId === 'loa_deny') {
                interaction.message.embeds.forEach( async (embed) => {
        embed.fields.forEach((field) => {
          if(field.name === 'Start Time') {
            startTime = field.value;
          } else if(field.name === 'End Time') {
            endTime = field.value;
          } else if(field.name === 'Total Time') {
            totalTime = field.value;
          } else if (field.name === 'Evidence') {
            evidence = field.value;
          }
        })
        const authorArgs = embed.author.name.split(" ")
        foundUser = await interaction.guild.members.fetch(authorArgs[authorArgs.length - 1])
      })

      await wait(2000)
      
      let disName = foundUser.displayName
let splitName = disName.split(" ")
let userOnly = splitName[splitName.length - 1]

    const dropdownMenu = new Discord.ActionRowBuilder()
			.addComponents(
				new Discord.StringSelectMenuBuilder()
					.setCustomId('loa-deny-selection')
					.setPlaceholder('Nothing selected')
					.addOptions(
						{
							label: 'Invalid dates',
							description: 'The dates provided are invalid.',
							value: 'first_option',
						},
						{
							label: 'Leave of absence is too long',
							description: 'The LOA exceeds the maximum days allowed,',
							value: 'second_option',
						},
            {
							label: 'Too many LOAs submitted',
							description: 'The operative has submitted too many LOAs within this month.',
							value: 'third_option',
						},
            {
							label: 'Not Disclosed Reason',
							description: 'The reason of their LOA being denied will not be disclosed with them.',
							value: 'fourth_option',
						},
            {
							label: 'Other',
							description: 'The reason of their LOA being denied is not on this list.',
							value: 'fifth_option',
						},
					),
			);

      
      const channelDeniedEmbed = new EmbedBuilder()
      .setTitle('Denied LOA')
      .setDescription('Please select the reason you denied their LOA on the dropdown menu below.')
      .setTimestamp()
      .setFooter({text: 'SWAT Automation', iconURL: process.env.image}) 

      // embeds: [channelDeniedEmbed],
      // components: [dropdownMenu],

      interaction.reply({ content: `${foundUser.id}`, embeds: [channelDeniedEmbed], components: [dropdownMenu], ephemeral: true})
      interaction.message.edit({content: `LOA denied by ${interaction.member.displayName}.`, components: [] })
    }
  }
});

// dropdown handler
client.on(Events.InteractionCreate, async interaction => {
  let foundUser;
  let reason;
  	if (!interaction.isStringSelectMenu()) return;

  if(interaction.customId === 'deny-selection') {
    
        foundUser = await interaction.guild.members.fetch(interaction.message.content)    
interaction.message.embeds.forEach( async (embed) => {
      })

    interaction.values.forEach( async (value) => {
      if(value === 'first_option') {
        reason = 'Invalid Proof'
      } else if(value === 'second_option') {
        reason = 'Patrol Length Does Not Meet Minimum Standards'
      } else if(value === 'third_option') {
        reason = 'Too many logs submitted within one day, exceeding the daily limit.'
      } else if(value === 'fourth_option') {
        reason = 'No reason provided'
      } else if(value === 'fifth_option') {
        reason = 'Other'
      }
    })

    const newEmbedInChannel = new EmbedBuilder()
    .setTitle('Success')
    .setDescription(`I have succesfully denied their patrol with reason: **${reason}**`)
    .setTimestamp()
    .setFooter({text: 'SWAT Automation', iconURL: process.env.image})

    const sendToPersonDenied = new EmbedBuilder()
    .setTitle('Patrol Denied')
    .setDescription(`Your patrol has been denied with reason: **${reason}**.`)
    .setTimestamp()
    .setColor(0xEE4B2B)
    .setFooter({text: 'SWAT Automation', iconURL: process.env.image})

    interaction.reply({content: '', embeds: [newEmbedInChannel], components: [], ephemeral: true})
    foundUser.send({embeds: [sendToPersonDenied]})
  }
  if(interaction.customId === 'loa-deny-selection') {
    foundUser = await interaction.guild.members.fetch(interaction.message.content)    
interaction.message.embeds.forEach( async (embed) => {
      })

    interaction.values.forEach( async (value) => {
      if(value === 'first_option') {
        reason = 'Invalid Dates'
      } else if(value === 'second_option') {
        reason = 'Leave of Absence exceeds maximum alloted days'
      } else if(value === 'third_option') {
        reason = 'Too many absences submitted within the month'
      } else if(value === 'fourth_option') {
        reason = 'No reason provided'
      } else if(value === 'fifth_option') {
        reason = 'Other'
      }
    })

    const newEmbedInChannel = new EmbedBuilder()
    .setTitle('Success')
    .setDescription(`I have succesfully denied their LOA with reason: **${reason}**`)
    .setTimestamp()
    .setFooter({text: 'SWAT Automation', iconURL: process.env.image})

    const sendToPersonDenied = new EmbedBuilder()
    .setTitle('LOA Denied')
    .setDescription(`Your LOA has been denied with reason: **${reason}**.`)
    .setTimestamp()
    .setColor(0xEE4B2B)
    .setFooter({text: 'SWAT Automation', iconURL: process.env.image})

    interaction.reply({content: '', embeds: [newEmbedInChannel], components: [], ephemeral: true})
    foundUser.send({embeds: [sendToPersonDenied]})
  }
})

client.login(process.env.token);