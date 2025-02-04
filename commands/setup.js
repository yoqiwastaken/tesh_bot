const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const db = require('../libs/db');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('setup den Bot für den Server')
        .addRoleOption(option =>
            option.setName('admin')
                .setDescription('Admin Rolle (kann Bot Einstellungen vornehmen)')
                .setRequired(true)),
    async execute(client, interaction) {
        try {
            if (db.getServer(interaction.guildId).setup) {
                interaction.reply('Kein setup nötig :)');
                return;
            }
        } catch (e) { }
        db.setServer(interaction.guild,);
        let server = db.getServer(interaction.guildId);
        const role = interaction.options.getRole('admin');
        server.adminrole = role.id;
        interaction.guild.channels.create("Tesh Bot", {
            type: "GUILD_CATEGORY"
        }).then(category => {
            interaction.guild.channels.create("dev", {
                type: "GUILD_TEXT"
            }).then(channel => {
                channel.setParent(category);
                channel.permissionOverwrites.edit(interaction.guild.id, {
                    VIEW_CHANNEL: false
                });
                channel.permissionOverwrites.edit(server.adminrole, {
                    VIEW_CHANNEL: true
                });
                channel.permissionOverwrites.edit(interaction.user.id, {
                    VIEW_CHANNEL: true
                });
            });
            interaction.guild.channels.create("ideen bugs fqs", {
                type: "GUILD_TEXT",
                topic: "check the pins"
            }).then(channel => {
                channel.setParent(category);
                channel.send(`>>> Checkt die **Pins für Hilfe** oder **Schreibt euer Anliegen** hier rein und pingt dann <@!652959577293324288>.`).then(msg => msg.pin());
            });
            interaction.guild.channels.create("tesh feed", {
                type: "GUILD_NEWS",
                topic: "Updates Feed für Tesh"
            }).then(channel => {
                channel.setParent(category);
                channel.send(`__**TESH-FEED**__`);
                let sv = db.getServer(channel.guildId);
                sv.feed = channel.id;
                db.updateServer(sv);
            });
            let sv = db.getServer(category.guildId);
            sv.category = category.id;
            db.updateServer(sv);
        });

        server.setup = true;
        server = db.updateServer(server);
        db.setChannels(server);
        interaction.reply('fertig mit setup :relieved:');
    },
};