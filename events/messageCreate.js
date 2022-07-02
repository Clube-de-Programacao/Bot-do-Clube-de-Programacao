module.exports = {
	name: "messageCreate",
	
	async execute(client, message) {
		if (message.author.id !== client.id && message.content.startsWith("\\")) {
			await message.reply("Ainda vamos implementar os comandos por mensagem, com o prefixo \\");
		}
	}
};
