const { SlashCommandBuilder } = require("@discordjs/builders");
const { getProjectList, setProjectStatus, projectsIds } = require("../modules/project-manager.js");
const { restartHerokuApp } = require("../modules/heroku-app-manager.js");

const projectOptions = getProjectList();


module.exports = {
	data: new SlashCommandBuilder()
		.setName("definir-status-de-projeto")
		.setDescription("Define o status do projeto atual (ativo ou arquivado)")
		.addStringOption(project =>
			project
				.setName("projeto")
				.setDescription("Nome do projeto a ser alterado")
				.setRequired(true)
				.addChoices(...projectOptions)
		)
		.addBooleanOption(boolean =>
			boolean
				.setName("status")
				.setDescription("O novo status do projeto em questão")
				.setRequired(true)
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

		setProjectStatus(projectName, options[1].value);

		await interaction.reply(`O projeto **${projectName}** foi definido como ${options[1].value ? "__ativo__" : "__arquivado__"}`);

		restartHerokuApp();
	}
};
