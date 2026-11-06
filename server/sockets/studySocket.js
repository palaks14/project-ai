module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected to socket:', socket.id);

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
      socket.to(roomId).emit('user-joined', { userId: socket.id });
    });

    socket.on('start-pomodoro', ({ roomId, duration }) => {
      io.to(roomId).emit('timer-started', { duration, startTime: Date.now() });
    });

    socket.on('send-message', ({ roomId, message, user }) => {
      io.to(roomId).emit('new-message', { message, user, timestamp: Date.now() });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
