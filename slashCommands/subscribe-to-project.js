const { SlashCommandBuilder } = require("@discordjs/builders");
const { getProjectNameList, getProjectsObject, subscribe, projectsIds } = require("../modules/project-manager.js");
const { registerCommands } = require("../deploy-commands.js");

const projectOptions = getProjectNameList();


module.exports = {
	data: new SlashCommandBuilder()
		.setName("inscrição")
		.setDescription("Inscreve o usuário em um dos projetos do clube")
		.addStringOption(project =>
			project
				.setName("projeto")
				.setDescription("Nome do projeto em qual você se inscreverá")
				.setRequired(true)
				.addChoices(...projectOptions)
		),

	restriction: [],

	async execute(client, interaction) {
		const projects = getProjectList();

		if (interaction.channelId !== projectsIds.mainChannel) {
			await interaction.reply({ content: "Esse não é o canal para a inscrição em um projeto. Use esse comando no \"geral\" da categoria de projetos", ephemeral: true})
			return;
		}

		const projectIndex = projectOptions.findIndex(project => project.value === interaction.options._hoistedOptions[0].value);
		const projectName = projectOptions[projectIndex].name;

		if (Object.values(projects[projectIndex]["participants"]).includes(interaction.user.id)) {
			await interaction.reply({ content: `Ops, você já está inscrito(a) no projeto **${projectName}**. Esse comando foi descartado`, ephemeral: true});
			return;
		}

		await interaction.user.send(`Agora você está inscrito(a) no projeto **${projectName}** do Clube de Programação!`);

		subscribe(projectIndex, interaction);

		await interaction.reply(`Inscrição feita!\n\n**${interaction.user.username}** agora está inscrito(a) no projeto **${projectName}**`);

		registerCommands();
	}
};
