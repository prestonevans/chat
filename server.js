const fs = require('fs');
const net = require('net');

const clients = [];
let count = 0;

const server = net
	.createServer((client) => {
		clients.push({ client: client, id: ++count });
		let activeClient;
		for (let i = 0; i < clients.length; i++) {
			if (clients[i].client == client) {
				activeClient = clients[i].id;
			}
		}
		for (let i = 0; i < clients.length; i++) {
			if (clients[i].client != client) {
				clients[i].client.write(`Guest${activeClient} has joined the chat.`)
			}
		}
		client.on('data', (chunk) => {
			for (let i = 0; i < clients.length; i++) {
				if (clients[i].client != client) {
					clients[i].client.write(`Guest${activeClient} says: ${chunk}`);
				}
			}
			fs.appendFile('log.txt', `Guest${activeClient} says: ${chunk}\n`, (err) => {
				if(err) throw err
			})
		});
		client.on('end', () => {
			for (let i = 0; i < clients.length; i++) {
				if (clients[i].client != client) {
					clients[i].client.write(`Guest${activeClient} left the chat`);
				}
			}
			fs.appendFile('log.txt', `Guest${activeClient} left the chat\n`, (err) => {
				if(err) throw err
			})
		});
	})
	.listen(5000);
	server.on('connection', (client) => {
		client.write(`Welcome to the chat room, Guest${count}!\n`);
		fs.appendFile('log.txt', `Guest${count} joined the server\n`, (err) => {
			if(err) throw err
		})
	})

console.log('Listening on port 5000');
