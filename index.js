const express = require("express");
const app = express();

const fs = require("node:fs");
const path = require("node:path");
const aws = require("aws-sdk");

const { name, version} = require("./config.json");
const { Client, IntentsBitField, Collection } = require("discord.js");
const { registerCommands } = require("./deploy-commands.js");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`))

let s3 = new aws.S3({
	accessKeyId: process.env.S3_KEY,
	secretAccessKey: process.env.S3_SECRET
});

// Obtendo as config vars da Heroku
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

// Tirado de "preinstall" em package.json: npm install heroku-client --save && 

// const Heroku = require("heroku-client");
// const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN });

const botIntents = new IntentsBitField();
botIntents.add(IntentsBitField.Flags.Guilds)

const client = new Client({ intents: botIntents });
client.name = name; client.version = version;

registerCommands();

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

client.commands = new Collection();
const commandsPath = path.join(__dirname, "slashCommands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));


// Listagem dos comandos
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	
	client.commands.set(command.data.name, command);
}

// Event handler
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}

client.login(token);

// Permissões customizadas utilizadas em outros arquivos: DIRECTOR_ONLY
