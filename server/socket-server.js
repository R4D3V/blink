const { createServer } = require('http')
const { Server } = require('socket.io')

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

// Store online users
const onlineUsers = new Map()

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  // User joins
  socket.on('user:join', (userId) => {
    onlineUsers.set(userId, socket.id)
    socket.userId = userId
    console.log(`User ${userId} joined`)

    // Broadcast user online status
    io.emit('user:status', {
      userId,
      status: 'online',
    })
  })

  // Join conversation
  socket.on('conversation:join', (conversationId) => {
    socket.join(`conversation:${conversationId}`)
    console.log(`User ${socket.userId} joined conversation ${conversationId}`)
  })

  // Send message
  socket.on('message:send', ({ conversationId, message }) => {
    console.log(`Message from ${socket.userId} in ${conversationId}`)
    
    // Broadcast to conversation room
    io.to(`conversation:${conversationId}`).emit('message:new', {
      ...message,
      status: 'delivered',
    })

    // Send delivery confirmation to sender
    socket.emit('message:delivered', {
      messageId: message.id,
      status: 'delivered',
    })
  })

  // Typing status
  socket.on('typing:send', ({ conversationId, userId, isTyping }) => {
    socket.to(`conversation:${conversationId}`).emit('user:typing', {
      conversationId,
      userId,
      isTyping,
    })
  })

  // Video/Audio call signaling
  socket.on('call:user', ({ userToCall, signalData, from }) => {
    const targetSocketId = onlineUsers.get(userToCall)
    if (targetSocketId) {
      io.to(targetSocketId).emit('call:incoming', {
        signal: signalData,
        from,
      })
    }
  })

  socket.on('call:answer', ({ signal, to }) => {
    const targetSocketId = onlineUsers.get(to)
    if (targetSocketId) {
      io.to(targetSocketId).emit('call:accepted', signal)
    }
  })

  socket.on('call:end', ({ to }) => {
    const targetSocketId = onlineUsers.get(to)
    if (targetSocketId) {
      io.to(targetSocketId).emit('call:ended')
    }
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
    
    if (socket.userId) {
      onlineUsers.delete(socket.userId)
      
      // Broadcast user offline status
      io.emit('user:status', {
        userId: socket.userId,
        status: 'offline',
      })
    }
  })
})

const PORT = process.env.SOCKET_PORT || 3001

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`)
})

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  httpServer.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})
