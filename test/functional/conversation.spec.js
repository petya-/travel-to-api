'use strict';
const { test, trait, before, after } = use('Test/Suite')('Conversation');
const User = use('App/Models/User');
const Trip = use('App/Models/Trip');
const Message = use('App/Models/Message');
const Event = use('Event');

const { DateTime } = require('luxon');

trait('Test/ApiClient');
trait('Auth/Client');

let conversations,
  conversation,
  passengerUser,
  driverUser,
  adminUser,
  trip,
  tripRequest;

before(async () => {
  passengerUser = await User.findBy('email', 'passenger@travel-to.com');
  driverUser = await User.findBy('email', 'driver@travel-to.com');
  adminUser = await User.findBy('email', 'admin@travel-to.com');

  trip = await Trip.findOrFail(21);
  tripRequest = await trip.tripRequests().first();
  conversation = await tripRequest
    .conversation()
    .with('messages')
    .with('messages.sender')
    .with('messages.receiver')
    .with('trip')
    .with('tripRequest')
    .fetch();

  conversations = await passengerUser
    .conversations()
    .with('messages')
    .with('messages.sender')
    .with('messages.receiver')
    .with('trip')
    .with('tripRequest')
    .fetch();
});

test('cannot get user conversations if not authorized', async ({ client }) => {
  const response = await client.get('api/conversations').end();

  response.assertStatus(401);
  response.assertError([
    'InvalidJwtToken: E_INVALID_JWT_TOKEN: jwt must be provided'
  ]);
});

test('can get user conversation with messages', async ({ client, assert }) => {
  const response = await client
    .get('api/conversations')
    .loginVia(passengerUser, 'jwt')
    .end();

  const { data } = response.body;

  response.assertStatus(200);
  assert.equal(data.length, conversations.toJSON().length);
});

test('can get a conversation by id', async ({ client, assert }) => {
  const response = await client
    .get(`api/conversations/${conversation.id}`)
    .loginVia(passengerUser, 'jwt')
    .end();
  const { data } = response.body;

  response.assertStatus(200);
  assert.equal(data.id, conversation.id);
  assert.isArray(data.messages);
  assert.isObject(data.messages[0].sender);
  assert.isObject(data.messages[0].receiver);
  assert.isObject(data.trip);
  assert.isObject(data.tripRequest);
});

test('cannot get a conversation by id if the user is not part of the conversation', async ({
  client
}) => {
  const response = await client
    .get(`api/conversations/${conversation.id}`)
    .loginVia(adminUser, 'jwt')
    .end();

  response.assertStatus(403);

  response.assertError({
    status: 'error',
    message:
      'You are not part of the conversation that you are trying to access.'
  });
});

test('can send a message', async ({ client, assert }) => {
  Event.fake();

  const message =
    'Hi, I can pick you up without a problem. What is your exact location?';
  const response = await client
    .post(`api/conversations/${conversation.id}/message`)
    .send({
      message,
      receiver_id: passengerUser.id
    })
    .loginVia(driverUser, 'jwt')
    .end();

  response.assertStatus(200);

  assert.equal(response.body.data.message, message);
  assert.equal(response.body.data.read, null);
  assert.equal(response.body.data.sender_id, driverUser.id);
  assert.equal(response.body.data.receiver_id, passengerUser.id);
  assert.equal(response.body.data.conversation_id, conversation.id);

  const recentEvent = Event.pullRecent();
  assert.equal(recentEvent.event, 'new::message');

  Event.restore();
});

test('cannot send a message if a user is not part of the conversation', async ({
  client,
  assert
}) => {
  const message =
    'Hi, I can pick you up without a problem. What is your exact location?';
  const response = await client
    .post(`api/conversations/${conversation.id}/message`)
    .send({
      message,
      receiver_id: driverUser.id
    })
    .loginVia(adminUser, 'jwt')
    .end();

  response.assertStatus(403);
  response.assertError({
    status: 'error',
    message:
      'You are not part of the conversation that you are trying to access.'
  });
});

test('can mark message as read', async ({ client, assert }) => {
  const message = await Message.findOrFail(2);
  assert.equal(message.read, null);

  const response = await client
    .put(`api/messages/${message.id}`)
    .loginVia(passengerUser, 'jwt')
    .end();

  response.assertStatus(200);
  assert.notEqual(response.body.data.read, null);
});

test('cannot mark message as read if the user is not the receiver_id', async ({
  client
}) => {
  const message = await Message.findOrFail(2);
  const response = await client
    .put(`api/messages/${message.id}`)
    .loginVia(adminUser, 'jwt')
    .end();

  message.read = DateTime.utc();
  response.assertStatus(403);
  response.assertError({
    status: 'error',
    message: 'Cannot mark as read a message that is not addressed to you!'
  });
});

test('cannot mark message as read if the message does not exist', async ({
  client
}) => {
  const response = await client
    .put(`api/messages/12`)
    .loginVia(driverUser, 'jwt')
    .end();

  response.assertStatus(404);
  response.assertError({
    status: 'error',
    message: 'The message does not exist.'
  });
});

test('cannot close a conversation that I am not part of', async ({
  client
}) => {
  const response = await client
    .put(`api/conversations/${conversation.id}`)
    .loginVia(adminUser, 'jwt')
    .end();

  response.assertStatus(403);
  response.assertError({
    status: 'error',
    message:
      'You are not part of the conversation that you are trying to access.'
  });
});

test('can close a conversation', async ({ client, assert }) => {
  assert.equal(conversation.active, true);

  const response = await client
    .put(`api/conversations/${conversation.id}`)
    .loginVia(driverUser, 'jwt')
    .end();

  response.assertStatus(200);
  assert.equal(response.body.data.active, false);
});
