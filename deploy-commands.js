const fs = require("node:fs");
const path = require("node:path");

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const { clientId, token, guildId } = require("./config.json");

const rest = new REST({ version: "9" }).setToken(token);

const commands = [];
const commandsPath = path.join(__dirname, "slashCommands");


function getCommands() {
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		commands.push(command.data.toJSON());
	}
}

function registerCommands() {
	getCommands();

	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
		.then(() => console.log("Os slash commands da aplicação foram registrados com sucesso!"))
		.catch(console.error);
}


module.exports = {
	registerCommands
}
