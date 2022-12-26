const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js')
const Trello = require('trello')
const trello = new Trello(process.env.APIKey, process.env.APIToken)
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('check-quota')
		.setDescription(`Responds with how much time has been patrolled.`)
    .addUserOption(option =>
            option
                .setName('user')
                .setDescription('See how long someone else has patrolled!')
        )
    .addStringOption(option => 
        option
                     .setName('team')
                     .setDescription('See how long a unit has patrolled with specifics on operatives.')
                     .addChoices(
                       { name: `Ocean Platoon`, value: `ocean-patroltime` },
                       { name: `Tango Platoon`, value: `tango-patroltime` },
                       { name: `Platoon Operations Command`, value: `platoon-patroltime`},
                       { name: `Special Operations Command`, value: `speccommand-patroltime`},
                       { name: `Administrative Command`, value: `integrity-patroltime`},
                       { name: `Administration`, value: `admin-patroltime`}
                     )
      ),
	async execute(interaction, client) { 

    if(!interaction.member.roles.cache.some(role =>["Operative"].includes(role.name))) return interaction.reply({ content: `You don't have permission to run this command.` , ephemeral: true})
  
    let unitSlash = interaction.options.getString('team');
    let userMentioned = interaction.options.getUser('user');

    if(unitSlash === null) {

    let userId = '';
    let findUser = false;
    
let disName = interaction.member.displayName
let splitName = disName.split(" ")
let userOnly = splitName[splitName.length - 1]
    
    if(userMentioned === null) {
// hi
    } else if(userMentioned !== null) {
      userId = userMentioned.id;
      let newFoundUser = await interaction.guild.members.fetch(userId)

      await wait(1000)
      
      let disName1 = newFoundUser.displayName;
      let splitName1 = disName1.split(" ")
      userOnly = splitName1[splitName1.length - 1]
    }

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


if (!targetCard) {
  return interaction.reply({ content: `Your trello card (${userOnly}) could not be found on the database.`, ephemeral: true})
} else {
  cardID = targetCard.id
}


let fieldOnCard = await trello.getCustomFieldsOnCard(cardID)

let patrolField

    
await fieldOnCard.forEach(async function (item) {
    const fieldName = item.idCustomField
    
    if (fieldName === "609c721dd4b0de0900cf9aea") {
        patrolField = item
    }
})    

let patrolFieldVal = patrolField.value.number;

  let logField

await fieldOnCard.forEach(async function (item) {
    const fieldName = item.idCustomField
    
    if (fieldName === "6070f9cfc647d25d7f4f07e5") {
        logField = item
    }
})


let logFieldVal = logField.value.number;
    

    let channelSendEmbed = new EmbedBuilder()
	.setTitle(`Quota Check`)
	.addFields(
		{ name: 'Username', value: `${userOnly}` },
		{ name: 'Card Link', value: `[Trello](${targetCard.url})` },
		{ name: 'Patrol Time', value: `${patrolFieldVal}` },
		{ name: 'Logs Submitted', value: `${logFieldVal}` },
	)
	.setTimestamp()
	.setFooter({ text: 'SWAT Automation', iconURL: process.env.image });

    interaction.reply({ embeds: [channelSendEmbed], ephemeral: true})
    
    } else {
      let cardsOnBoard = await trello.getCardsOnBoard(process.env.BoardID)
      let totalTime = 0;

      let array1 = new Array()
      
      let unitToSearch
      let listToSearchId
      
      if(unitSlash === 'ocean-patroltime')  {
        unitToSearch = 'Ocean Platoon'
        listToSearchId = '6070fb74c1799c7fc95dafbd'
      }
      if(unitSlash === 'tango-patroltime') {
        unitToSearch = 'Tango Platoon'
        listToSearchId = '607e080c1d363e7c6b742ec7'
      }
      if(unitSlash === 'platoon-patroltime') {
        unitToSearch = 'Platoon Operations Command'
        listToSearchId = '626a918cdef76b0489267aec'
      }
      if(unitSlash === 'speccommand-patroltime') {
        unitToSearch = 'Special Operations Command'
        listToSearchId = '629fd3c71796242e1f255c19'
      }
      if(unitSlash === 'integrity-patroltime') {
        unitToSearch = 'Division Administrative Command'
        listToSearchId = '6397efd0b8b8a005626eef9d'
      }
      if(unitSlash === 'admin-patroltime') {
        unitToSearch = 'Administration'
        listToSearchId = '62bcaa6737fd981e2ac3ab97'
      }
      
      if(!unitToSearch) return interaction.reply({ content: `${unitSlash} is not a valid unit supported by this bot.`, ephemeral: true})
      
        interaction.reply({ content: `We have began searching through ${unitToSearch} to recieve their patrol information. This should take about twenty (20) seconds.`, ephemeral: true})

        let peopleOnList = await trello.getCardsOnList(listToSearchId)

        setTimeout(async function() {
      await peopleOnList.forEach(async function (item) {
    if(item.name === "SQUAD A: 1O" || item.name === "Platoon Ocean" || item.name === "----" || item.name === "SQUAD B: 2O" || item.name === "-----") return;
            if(item.name === "Platoon Tango" || item.name === "SQUAD C: 1T" || item.name === "----" || item.name === "SQUAD D: 2T" || item.name === "-----") return;
          if(item.idList === '607f10f13026e61f542aac58') return;



  const cname = item.name
  const cid = item.id

let fieldOnCard = await trello.getCustomFieldsOnCard(cid)

let patrolField
    
    
await fieldOnCard.forEach(async function (item1) {
    const fieldName = item1.idCustomField
    
    if (fieldName === "609c721dd4b0de0900cf9aea") {
        patrolField = item1
    }
})

        if(!patrolField.value.number) return

            totalTime = Number(totalTime) + Number(patrolField.value.number) 

        return array1.push(`${item.name} | Patrol Time: ${patrolField.value.number} minutes`)
      })
        }, 1000 )

      setTimeout(async function() {
        let mappedUsers = array1.map(x => x).join('\n')

  let channelSendEmbed2 = new EmbedBuilder()
	.setTitle(`${unitToSearch} Quota Check`)
    .setDescription(mappedUsers + `\n\n**Total Time:** ${totalTime} minutes`)
	.setTimestamp()
	.setFooter({ text: 'SWAT Automation', iconURL: process.env.image });

              interaction.followUp({content: `<@!${interaction.member.id}>`, embeds: [channelSendEmbed2], ephemeral: true})

      }, 20000)


    }
	},
};