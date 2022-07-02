const { SlashCommandBuilder } = require("@discordjs/builders");
const { addProject, projectsIds, projects } = require("../modules/project-manager.js")


module.exports = {
	data: new SlashCommandBuilder()
		.setName("criar-projeto")
		.setDescription("Cria um projeto do Clube de Programação")
		.addStringOption(name =>
			name
				.setName("nome")
				.setDescription("Nome do novo projeto")
				.setRequired(true))
		.addStringOption(description =>
			description
				.setName("descrição")
				.setDescription("Uma breve descrição do projeto")
				.setRequired(true))
		.addUserOption(user =>
			user
				.setName("representante")
				.setDescription("O membro do clube que vai ter permissão para administrar o projeto")
		),

	restriction: ["DIRECTOR_ONLY"],

	async execute(client, interaction) {
		if (interaction.channelId !== projectsIds.channel) {
			await interaction.reply({ content: "Esse não é o canal para a criação de projetos. Use esse comando no \"geral\" da categoria de projetos", ephemeral: true})
			return;
		}
		
		const options = interaction.options._hoistedOptions;

		const newProject = {
			"name": options[0].value,
			"description": options[1].value,
			"representative": options[2] ? [options[2].user.username, options[2].user.id] : null,
			"status": true,
			"participants": {}
		};

		if (Object.keys(projects).includes(newProject.name)) {
			await interaction.reply({ content: "Ops, esse projeto já existe no arquivo. Esse comando foi invalidado", ephemeral: true})
			return;
		}

		addProject(client, newProject, interaction);

		await interaction.reply(`Novo projeto criado!\n\n**Nome**: ${newProject.name}\n**Descrição**: ${newProject.description}`);
	}
};