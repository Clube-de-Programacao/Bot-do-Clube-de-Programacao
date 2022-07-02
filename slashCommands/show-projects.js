const { SlashCommandBuilder } = require("@discordjs/builders");
const { projects, projectsIds } = require("../modules/project-manager.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName("mostrar-projetos")
		.setDescription("Mostra todos os projetos do clube"),

	restriction: [],

	async execute(client, interaction) {
		if (interaction.channelId !== projectsIds.channel) {
			await interaction.reply({ content: "Esse não é o canal para mostrar todos os projetos do clube. Use esse comando no \"geral\" da categoria de projetos", ephemeral: true})
			return;
		}

		if (Object.keys(projects).length == 0) {
			await interaction.reply("Não há projetos salvos no arquivo de projetos do Clube de Programação.");
			return;
		}

		var projectsString = "Esses são os projetos do Clube de Programação:\n\n\n";
		var i = 0;

		// TODO: fazer a lista de projetos ficar mais bonitinha usando embeds

		for (const project in projects) {
			projectsString += `> **${projects[project].name}**\n${projects[project].description}\n\n**Representante:** ${projects[project].representative ? projects[project].representative : "[não há]"}\n**Status:** ${projects[project].status ? "*ativo*" : "*arquivado*"}\n\n**Participantes:**\n`;

			const participantKeys = Object.keys(projects[project].participants);
			if (participantKeys.length == 0) {
				projectsString += "[não há participantes inscritos]";
			} else {
				for (const participant in participantKeys) {
					projectsString += `- ${participantKeys[participant]}`;

					if (participant != participantKeys.length - 1)
						projectsString += "\n";
				}
			}

			if (i != Object.keys(projects).length - 1) {
				projectsString += `\n\n\n${"=============================="}\n\n\n`;
			}

			i++;
		}

		await interaction.reply(projectsString);
	}
};