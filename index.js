const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


io.on('connection', (socket) => {
    console.log('Novo usuário conectado!');

    socket.on('joinRoom', (room) => {
        socket.join(room); 
        console.log(`Usuário entrou na sala: ${room}`);
    });
    
    socket.on('chat message', (data) => {
        console.log(`Mensagem recebida na sala ${data.room}: ${data.message}`);
       
        io.to(data.room).emit('chat message', { user: data.user, message: data.message, time: data.time, room: data.room });
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});