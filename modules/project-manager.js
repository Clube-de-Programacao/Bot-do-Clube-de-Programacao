const fs = require("node:fs");
const path = require("node:path");

const projectsPath = path.join(__dirname, "../projects.json");
const projectsIds = { projectsCategory: process.env.PROJECTS_CATEGORY, mainChannel: process.env.PROJECTS_MAIN_CHANNEL };

function getProjectsObject() {
	try {
		console.log("SAMBA 1");
		var projects = require(projectsPath);
	} catch {
		console.log("O arquivo projects.json não existe ou está vazio. Escrevendo um arquivo com objeto JSON vazio...");

		fs.writeFileSync(projectsPath, "{}", error => {
			if (error) console.log(error);
		});

		var projects = require(projectsPath);
	}

	return projects;
}

function updateProjects() {
	const projects = getProjectsObject();

	fs.writeFile(projectsPath, JSON.stringify(projects, null, "\t"), error => {
		if (error) {
			console.log(error);
		} else {
			console.log("O arquivo foi escrito com sucesso.");
		}
	});
}

module.exports = {
	async addProject(client, newProject, interaction) {
		const projects = getProjectsObject();

		projects[newProject.name] = newProject;

		interaction.guild.roles.create({ name: newProject.name });

		await interaction.guild.channels.cache.get(interaction.channelId).parent
		.createChannel(newProject.name, { type: "GUILD_TEXT", topic: newProject.description })
		.then(channel => {
				channel.send(`Aqui começa o canal do projeto **${newProject.name}**\n\n**Descrição:** ${newProject.description}`);
				
				const roleId = interaction.guild.roles.cache.find(role => role.name === newProject.name).id;

				channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { "SEND_MESSAGES": false });
				channel.permissionOverwrites.edit(roleId, { "SEND_MESSAGES": true });
			}
		);

		updateProjects();
	},

	getProjectList() {
		const projects = getProjectsObject();
		
		var projectOptions = [];
		var projectKeys = Object.keys(projects);
		
		for (var option in projectKeys) {
			var projectName = projectKeys[option];
			projectOptions.push({ name: projectName, value: option });
		}

		return projectOptions;
	},
	
	subscribe(projectName, interaction) {
		const projects = getProjectsObject();
		
		projects[projectName]["participants"][interaction.user.username] = interaction.user.id;
		
		const role = interaction.guild.roles.cache.find(role => role.name === projectName);
		interaction.member.roles.add(role);

		updateProjects()
	},

	setProjectStatus(projectName, status) {
		const projects = getProjectsObject();
		
		projects[projectName].status = status;

		updateProjects();
	},

	removeProject(projectName) {
		const projects = getProjectsObject();
		
		delete projects[projectName];
		updateProjects();
	},
	
	getProjectsObject, projectsIds
};
