const guildId = process.env.guildId;

module.exports = {
	name: "interactionCreate",

	async execute(client, interaction) {
		if (!interaction.isCommand() || interaction.user.id === client.id) return;

		const command = client.commands.get(interaction.commandName);

		const guild = client.guilds.cache.get(guildId);
		const directors = guild.roles.cache.find(role => role.name === "Diretor").members;
		var directorsList = [];
		directors.forEach(director => {directorsList.push(director.user.id)});

		if (!command) return;

		if (command.restriction.includes("DIRECTOR_ONLY") && !directorsList.includes(interaction.user.id)) {
			interaction.reply({ content: "Ops, você não tem permissão para usar esse comando :confused:", ephemeral: true });
			return;
		}

		// TODO: fazer o bot também avisar que houve um erro quando o usuário usar um comando que não existe

		try {
			await command.execute(client, interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: "Houve um erro ao tentar executar esse comando", ephemeral: true });
		}
	}
};
