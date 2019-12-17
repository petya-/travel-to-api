const Ws = use('Ws');

function broadcast(id, type, data) {
  const channel = Ws.getChannel('conversation:*');

  if (!channel) return;
  const topic = channel.topic(`conversation:${id}`);

  if (!topic) {
    return;
  }

  emit, broadcast, broadcastToAll;
  topic.broadcast(`message`, {
    type,
    data
  });
}

module.exports = {
  broadcast
};
