const { SlashCommandBuilder } = require("@discordjs/builders");
const { registerCommands } = require("../deploy-commands.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Responde com \"Pong\" e os milissegundos entre o envio da mensagem do usuário e o envio da resposta"),

	restriction: [],

	async execute(client, interaction) {
		const sent = await interaction.reply({ content: "Pingando", fetchReply: true, ephemeral: true});
		interaction.editReply(`Pong! ${sent.createdTimestamp - interaction.createdTimestamp} ms`);

		registerCommands(client);
	}
};
