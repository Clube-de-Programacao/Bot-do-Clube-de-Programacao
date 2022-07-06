const fs = require("node:fs");
const path = require("node:path");

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

// Obtendo as config vars da Heroku
const clientId = process.env.CLIENT_ID;
const token = process.env.TOKEN;
const guildId = process.env.GUILD_ID;

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

function resetCommands(client) {
	const commands = client.guilds.cache.get(guildId).commands;
	
	Object.entries(commands.cache).forEach(command => {
		console.log(command);
	});

	//.forEach(command => {console.log(command)}));
	/*
	client.guilds.cache.get(guildId).commands.forEach(command => command.delete());
	
	
	console.log(client.guilds.cache.get(guildId).commands);
	
	registerCommands();

	console.log(client.guilds.cache.get(guildId).commands);
	*/
}


module.exports = {
	registerCommands, resetCommands
}
