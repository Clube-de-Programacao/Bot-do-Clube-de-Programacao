const { SlashCommandBuilder } = require("@discordjs/builders");
const { getProjectList, removeProject, projectsIds } = require("../modules/project-manager.js");
const { restartHerokuApp } = require("../modules/heroku-app-manager.js");

const projectOptions = getProjectList();


module.exports = {
	data: new SlashCommandBuilder()
		.setName("remover-projeto")
		.setDescription("Remove um projeto do arquivo")
		.addStringOption(project =>
			project
				.setName("projeto")
				.setDescription("Nome do projeto em qual você se inscreverá")
				.setRequired(true)
				.addChoices(...projectOptions)
		),
	
	restriction: ["DIRECTOR_ONLY"],

	async execute(client, interaction) {
		if (interaction.channelId !== projectsIds.mainChannel) {
			await interaction.reply({ content: "Esse não é o canal para a remoção de projetos. Use esse comando no \"geral\" da categoria de projetos", ephemeral: true})
			return;
		}

		const projectIndex = projectOptions.findIndex(p => p.value === interaction.options._hoistedOptions[0].value);
		const projectName = projectOptions[projectIndex]["name"];
		
		removeProject(projectName);

		// TODO: dar a opção de desfazer a deleção do projeto
		await interaction.reply(`O projeto **${projectName}** foi excluído do arquivo.`);

		restartHerokuApp();
	}
};
