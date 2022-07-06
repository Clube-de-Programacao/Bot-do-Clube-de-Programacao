const { SlashCommandBuilder } = require("@discordjs/builders");
const { getProjectList, subscribe, projects, projectsIds } = require("../modules/project-manager.js");
const { registerCommands } = require("../deploy-commands.js");

const projectOptions = getProjectList();


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
		if (interaction.channelId !== projectsIds.mainChannel) {
			await interaction.reply({ content: "Esse não é o canal para a inscrição em um projeto. Use esse comando no \"geral\" da categoria de projetos", ephemeral: true})
			return;
		}

		const projectIndex = projectOptions.findIndex(project => project.value === interaction.options._hoistedOptions[0].value);
		const projectName = projectOptions[projectIndex]["name"];

		if (Object.values(projects[projectName]["participants"]).includes(interaction.user.id)) {
			await interaction.reply({ content: `Ops, você já está inscrito(a) no projeto **${projectName}**. Esse comando foi descartado`, ephemeral: true});
			return;
		}

		await interaction.user.send(`Agora você está inscrito(a) no projeto **${projectName}** do Clube de Programação!`);

		subscribe(projectName, interaction);

		await interaction.reply(`Inscrição feita!\n\n**${interaction.user.username}** agora está inscrito(a) no projeto **${projectName}**`);

		registerCommands();
	}
};
