const { SlashCommandBuilder } = require("@discordjs/builders");
const { getProjectNameList, updateProjectInfo, projectsIds } = require("../modules/project-manager.js");
const { registerCommands } = require("../deploy-commands.js");

const projectOptions = getProjectNameList();


module.exports = {
	data: new SlashCommandBuilder()
		.setName("editar-projeto")
		.setDescription("Atualiza informações de um projeto existente em arquivo")
		.addStringOption(project =>
			project
				.setName("projeto")
				.setDescription("Nome do projeto a ser editado")
				.setRequired(true)
				.addChoices(...projectOptions)
		)
		.addStringOption(name =>
			name
				.setName("nome")
				.setDescription("Novo nome do projeto")
		)
		.addStringOption(description =>
			description
				.setName("descrição")
				.setDescription("Nova descrição do projeto")
		)
		.addUserOption(user =>
			user
				.setName("representante")
				.setDescription("Novo representante do projeto")
		)
		.addBooleanOption(boolean =>
			boolean
				.setName("status")
				.setDescription("O novo status do projeto")
		),

	restriction: ["DIRECTOR_ONLY"],

	async execute(client, interaction) {
		if (interaction.channelId !== projectsIds.mainChannel) {
			await interaction.reply({ content: "Esse não é o canal para a edição de projetos. Use esse comando no \"geral\" da categoria de projetos", ephemeral: true})
			return;
		}

		const options = interaction.options._hoistedOptions;
		const projectIndex = options[0].value;
		const projectName = projectOptions[projectIndex]["name"];

		const newInfo = {
			"name" : options[1].value,
			"description" : options[2].value,
			"representative" : options[3].value,
			"status" : options[4].value
		};

		console.log(newInfo.name, newInfo.description, newInfo.representative, newInfo.status);
		
		updateProjectInfo(projectName, newInfo);

		await interaction.reply(`O projeto **${projectName}** foi atualizado!\n\nNovos dados:\n**Nome**: ${newInfo.name}\n**Descrição**: ${newInfo.description}\n**Representante**: ${newInfo.representative}\n**Status**: ${newInfo.status ? "__ativo__" : "__arquivado__"}`);

		registerCommands();
	}
};
