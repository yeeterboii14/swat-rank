const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js')
const roblox = require('noblox.js')
const wait = require('node:timers/promises').setTimeout;
const Trello = require('trello')
const trello = new Trello(process.env.APIKey, process.env.APIToken)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Search an individual for any flags.')
    .addStringOption(option =>
		option.setName('username')
			.setDescription('The roblox username of the user you want to search')
			.setRequired(true))
    .setDMPermission(false),
	async execute(interaction, client) {

            if(!interaction.member.roles.cache.some(role =>["Admissions Officer"].includes(role.name))) return interaction.reply({ content: `You must be an admissions officer to run this command.` , ephemeral: true})


    interaction.deferReply({ ephemeral: true })

    let primaryMessage = await interaction.channel.send({ content: `Checking if user is valid **0/3**.`})

    const username = interaction.options.getString('username')

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
      return interaction.channel.send({ content: '', embeds: [invalidUserEmb]});
    }

    primaryMessage.edit({ content: `Performing profile scan **1/3**`})


    let playerInfo = await roblox.getPlayerInfo(id)

let badgeCount 
  
    try {
      badgeCount = await roblox.getPlayerBadges(id, 100, "Asc")
    } catch {
      badgeCount = new Array()
    }

let collectiblesCount
    
try {    
collectiblesCount = await roblox.getCollectibles({userId: id, sortOrder: "Asc", limit: 25})
} catch {
  collectiblesCount = new Array()
}

    let premium = await roblox.getPremium(id)

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

    let formatedJoinDate = formatDate(new Date(playerInfo.joinDate))

    let thumbnail_default = await roblox.getPlayerThumbnail(id, 420, "png", true, "Headshot")


    let profImgUrl;

    for(var i=0; i<thumbnail_default.length; i++) {
      profImgUrl = thumbnail_default[i].imageUrl
    }

    const profileEmbed = new EmbedBuilder()
    .setTitle(`Profile Scan For **${username}**`)
    .setDescription(`\`\`\`${playerInfo.blurb}\`\`\``)
    .setThumbnail(`${profImgUrl}`)
    	.addFields(
    { name: 'User ID', value: `${id}`, inline: true},
    { name: 'Display Name', value: `${playerInfo.displayName}`, inline: true},
    { name: 'Old Names', value: `${playerInfo.oldNames.length}`, inline: true},  
		{ name: 'Friend Count', value: `${playerInfo.friendCount}`, inline: true},
		{ name: 'Following', value: `${playerInfo.followingCount}`, inline: true},
		{ name: 'Followers', value: `${playerInfo.followerCount}`, inline: true },
    { name: 'Account Age', value: `${playerInfo.age} days (${formatedJoinDate})`, inline: true },
    { name: 'Badges', value: `${badgeCount.length}`, inline: true },
    { name: 'Collectibles', value: `${collectiblesCount.length}`, inline: true },
    { name: 'Premium', value: `${premium}`, inline: true },
	)
    .setFooter({text: 'SWAT Automation', iconURL: process.env.image})
    .setTimestamp()

    wait(2000) // just giving it time to like chill out

        await primaryMessage.edit({ content: `Performing inventory scan **2/3**`})

    let inventoryItems;

    let flaggedItems = new Array()

    try {
      inventoryItems = await roblox.getInventory({userId: id, assetTypes: ["Shirt", "Pants"], sortOrder: "Asc", limit: 100})
    } catch {
      console.log(`${username}'s inventory is closed lol`)
    }

    try {
    for(var i=0; i<inventoryItems.length; i++) {
      if(inventoryItems[i].name.includes('Mano') || inventoryItems[i].name.includes('PSP') || inventoryItems[i].name.includes('MCRS') || inventoryItems[i].name.includes('MCFD') || inventoryItems[i].name.includes('MCFR') || inventoryItems[i].name.includes('MCSO') || inventoryItems[i].name.includes('MPD') || inventoryItems[i].name.includes('MBPD') || inventoryItems[i].name.includes('CTPD') || inventoryItems[i].name.includes('CPD')) flaggedItems.push(`[${inventoryItems[i].name}](https://roblox.com/catalog/${inventoryItems[i].assetId})`)
    }
      
    } catch {
    flaggedItems.push('Inventory Closed');
    }

    wait(3000)

    if(flaggedItems.length == 0) flaggedItems.push('No flags identified.')

    let mappedInven = flaggedItems.map(x => x).join('\n')

    const inventoryScan = new EmbedBuilder()
    .setTitle('Inventory Scan')
    .setDescription(`Possible Inventory Flags (${flaggedItems.length}):\n\n${mappedInven}`)
        .setFooter({text: 'SWAT Automation', iconURL: process.env.image})
    .setTimestamp()

            await primaryMessage.edit({ content: `Performing group scan **3/3**`})

    wait(15000)


    const groups = await roblox.getGroups(id)

        const cardsOnList = await trello.getCardsForList('63a7b98ba30ac7008ae4a674')


    const flaggedGroups = new Array()
    const manuallyFlaggedGroups =  new Array()

   for(var i=0; i<groups.length; i++) {
      const groupFound = await roblox.getGroup(groups[i].Id)

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

    wait(2000)


    let mappedUsers = flaggedGroups.map(x => x).join('\n')
    let mappedUsers2 = manuallyFlaggedGroups.map(x => x).join('\n')


        const groupScan = new EmbedBuilder()
    .setTitle('Group Scan')
    .setDescription(`Automatic Group Flags (${flaggedGroups.length}):\n\n${mappedUsers}\n\nManually Flagged Groups (${manuallyFlaggedGroups.length}):\n\n${mappedUsers2}`)
        .setFooter({text: 'SWAT Automation', iconURL: process.env.image})
    .setTimestamp()

    primaryMessage.delete()
   interaction.channel.send({content: `<@!${interaction.member.id}>`, embeds: [profileEmbed,inventoryScan,groupScan]})
	},
};