function send_message (message) {
	await message.channel.send(message.content);//.split(" "));
}

const allFunctions = [];
for (const i in window) {
	if ((typeof window[i]).toString() === "function") {
		allFunctions.push(window[i].name);
	}
}

module.exports = {
	name: "message-commands",

	async execute(client, message) {

	}
}
