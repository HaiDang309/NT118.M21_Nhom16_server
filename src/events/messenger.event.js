const { Message } = require('../models');

module.exports = (io, socket) => {
  const sendPrivateMessages = async (payload) => {
    const { messageId, content, from, to } = payload;
    const newMessage = await Message.create({ message_id: messageId, content, from, to });
    socket.to(to).emit('messenger:send_private_message', newMessage);
  };

  const readMessages = async () => {
    await Message.updateMany({ is_unread: true }, { $set: { is_unread: false } }, { multi: true });
  };

  socket.on('messenger:send_private_message', sendPrivateMessages);
  socket.on('messenger:read_message', readMessages);
};
