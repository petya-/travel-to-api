const Ws = use('Ws');

function broadcastMessage(id, type, data) {
  const channel = Ws.getChannel('conversation:*');

  if (!channel) return;
  const topic = channel.topic(`conversation:${id}`);

  if (!topic) {
    return;
  }

  topic.broadcast(`message`, {
    type,
    data
  });
}

function broadcastNotification() {}

module.exports = {
  broadcastMessage,
  broadcastNotification
};
