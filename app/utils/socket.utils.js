const Ws = use('Ws');

function broadcastMessage(conversation_id, type, data) {
  const channel = Ws.getChannel('conversation:*');

  if (!channel) return;
  const topic = channel.topic(`conversation:${conversation_id}`);

  if (!topic) {
    return;
  }

  topic.broadcast(`message`, {
    type,
    data
  });
}

function broadcastNotification(user_id, type, data) {
  const channel = Ws.getChannel('notification:*');

  if (!channel) return;
  const topic = channel.topic(`notification:${user_id}`);

  if (!topic) {
    return;
  }

  topic.broadcast(`notification`, {
    type,
    data
  });
}

module.exports = {
  broadcastMessage,
  broadcastNotification
};
