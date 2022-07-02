module.exports = {
	name: "ready",

	once: true,
	
	execute(client) {
		console.log(`\n| ${client.name} v${client.version}\n| Logado como ${client.user.tag}\n`);
	}
};