'use strict';
const { test, trait, before, after } = use('Test/Suite')('Conversation');
const User = use('App/Models/User');
const Trip = use('App/Models/Trip');

trait('Test/ApiClient');
trait('Auth/Client');

let conversations, conversation, passengerUser, driverUser, trip, tripRequest;

before(async () => {
  passengerUser = await User.findBy('email', 'passenger@travel-to.com');
  driverUser = await User.findBy('email', 'driver@travel-to.com');
  trip = await Trip.findOrFail(21);
  tripRequest = await trip.tripRequests().first();
  conversation = await tripRequest
    .conversation()
    .with('messages')
    .fetch();

  conversations = await passengerUser
    .conversations()
    .with('messages')
    .fetch();
});

test('cannot get user conversations if not authorized', async ({ client }) => {
  const response = await client.get('api/conversations').end();

  response.assertStatus(401);
  response.assertError([
    'InvalidJwtToken: E_INVALID_JWT_TOKEN: jwt must be provided'
  ]);
});

test('can get user conversation with messages', async ({ client }) => {
  const response = await client
    .get('api/conversations')
    .loginVia(passengerUser, 'jwt')
    .end();

  response.assertStatus(200);

  response.assertJSON({
    status: 'success',
    conversations: conversations.toJSON()
  });
});

test('can send a message', async ({ client, assert }) => {
  const message =
    'Hi, I can pick you up without a problem. What is your exact location?';
  const response = await client
    .post(`api/conversations/${conversation.id}/message`)
    .send({
      message,
      receiver_id: driverUser.id
    })
    .loginVia(passengerUser, 'jwt')
    .end();
  response.assertStatus(200);

  assert.equal(response.body.message.message, message);
  assert.equal(response.body.message.read, null);
  assert.equal(response.body.message.sender_id, passengerUser.id);
  assert.equal(response.body.message.receiver_id, driverUser.id);
  assert.equal(response.body.message.conversation_id, conversation.id);
});
