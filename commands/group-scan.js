const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js')
const roblox = require('noblox.js')
const wait = require('node:timers/promises').setTimeout;
const Trello = require('trello')
const trello = new Trello(process.env.APIKey, process.env.APIToken)
const groupId = 13372485;
const axios = require('axios')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('group-scan')
		.setDescription('Scan all operatives for any flagged groups.')
    .setDMPermission(false),
	async execute(interaction, client) {

            if(!interaction.member.roles.cache.some(role =>["Standards Division"].includes(role.name))) return interaction.reply({ content: `You don't have permission to run this command.` , ephemeral: true})


    interaction.deferReply({ ephemeral: true })

    let primaryMessage = await interaction.channel.send({ content: `Pushing all users within the group to an array.`})

      const ranksInGroup = await roblox.getRoles(Number(groupId)).catch(err => {
    primaryMessage.edit({content: 'There was a problem while attempting to achieve the Group Members in group ' + groupId})
  })

    let finishedEmbed = new EmbedBuilder()
    
      let userIdGroup = new Array();
    let flaggedGroups;
    let manuallyFlaggedGroups;

  await axios.get(`https://groups.roblox.com/v1/groups/${groupId}/users`)
      .then(async (res) => {
        await res.data.data.forEach(async (data) => {
          userIdGroup.push(data.user.userId)
        })
      })
      .catch(error => {
        return primaryMessage.edit({content: 'An error has occured while attempting to retrieve everyone inside the ROBLOX Group.'})
      })  

    let estimatedTimeToComplete = userIdGroup.length * 30000;
    let estimatedTimeToMinutes = Math.floor(estimatedTimeToComplete / 60000)

            await primaryMessage.edit({ content: `Beginning to scan through ${userIdGroup.length} members. This will take an estimated ${estimatedTimeToMinutes} minutes to complete to avoid rate limitations.`})

    let fieldsOnEmbed = 0;

    setTimeout(async function () {

      let id;
    for(var i=0; i<userIdGroup.length; i++) {

      id = userIdGroup[i]

    const groups = await roblox.getGroups(id)

        const cardsOnList = await trello.getCardsForList('63a7b98ba30ac7008ae4a674')


    flaggedGroups = new Array()
    manuallyFlaggedGroups =  new Array()

   for(var f=0; f<groups.length; f++) {
      const groupFound = await roblox.getGroup(groups[f].Id)

      if(groupFound.name.includes('Mano') || groupFound.name.includes('Pennsylvania') || groupFound.name.includes('PA') || groupFound.name.includes('MCSO') || groupFound.name.includes('MCRS') || groupFound.name.includes('PSP') || groupFound.name.includes('PNG') || groupFound.name.includes('MCFR') || groupFound.name.includes('MCFD') || groupFound.name.includes('CTPD') || groupFound.name.includes('MPD') || groupFound.name.includes('MBPD')) {
        if(groupFound.owner.username === 'Mano_South' || groupFound.owner.username === 'MCSOManager' || groupFound.owner.username === 'MCSO_Management' || groupFound.owner.username === 'superguy611') {
          
        } else {
          flaggedGroups.push(`[${groupFound.name}](https://roblox.com/groups/${groupFound.id}) owned by [${groupFound.owner.username}](https://roblox.com/users/${groupFound.owner.userId}) with ${groupFound.memberCount} members`)
        }
      }

  await cardsOnList.forEach(async function (item) {
      if(item.name == groupFound.id)           manuallyFlaggedGroups.push(`[${groupFound.name}](https://roblox.com/groups/${groupFound.id}) owned by [${groupFound.owner.username}](https://roblox.com/users/${groupFound.owner.userId}) with ${groupFound.memberCount} members`)
  })
    }
    }

      wait(3000)

      let username2 = await roblox.getUsernameFromId(id)

          let mappedUsers = flaggedGroups.map(x => x).join('\n')
    let mappedUsers2 = manuallyFlaggedGroups.map(x => x).join('\n')

      finishedEmbed.addFields({ name: `Flagged ${username2}`, value: `Automatic Flagged Groups (${flaggedGroups.length})\n\n${mappedUsers}\n\n Manually Flagged Groups (${manuallyFlaggedGroups.length})\n\n${mappedUsers2}`, inline: false})
      
      fieldsOnEmbed = Number(fieldsOnEmbed) + Number('1')

      console.log(fieldsOnEmbed)
      console.log(i)

      if(fieldsOnEmbed === 25) {
        finishedEmbed.setTitle(`Flagged Users`);
        finishedEmbed.setDescription(`The following users have been flagged, the search has not been completed until the bot pings you.`);
        finishedEmbed.setTimestamp()
    finishedEmbed.setFooter({text: 'SWAT Automation', iconURL: process.env.image})

        interaction.channel.send({ embeds: [finishedEmbed] })
        fieldsOnEmbed = 0;
        finishedEmbed = new EmbedBuilder()
      }
      if(i === userIdGroup.length) {
        finishedEmbed.setTitle(`Completed Flagging Users`);
        finishedEmbed.setDescription(`We have finished flagging all users, and all user flags are listed in the embeds above.`);
        finishedEmbed.setTimestamp()
    finishedEmbed.setFooter({text: 'SWAT Automation', iconURL: process.env.image})

        interaction.channel.send({content: `<@!${interaction.member.id}>`, embeds: [finishedEmbed] })
        fieldsOnEmbed = 0;
        finishedEmbed = new EmbedBuilder()
      }
    }, 30000 )
	},
};