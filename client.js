const net = require('net');
let input = process.stdin;

const client = net.createConnection({ port: 5000 }, () => {
	console.log('connected');
});

client.on('data', (data) => {
	console.log(String(data).trim());
});

input.on('data', (data) => {
	client.write(String(data).trim());
});

// needs to listen to data events

// client object has a unique id

// sever log file tracks when they connect and acitvity
