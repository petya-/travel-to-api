'use strict';
const { test, trait, before, after } = use('Test/Suite')('Authenthication');
const User = use('App/Models/User');
const Event = use('Event');

trait('Test/ApiClient');
trait('Auth/Client');

test('user can signup via email as passenger', async ({ client, assert }) => {
  Event.fake();

  const userData = {
    name: 'Joe Doe',
    email: 'joe@example.com',
    password: 'mySecurePassword',
    phone_number: '22344356'
  };

  const response = await client
    .post('api/auth/register')
    .send(userData)
    .end();

  response.assertStatus(200);
  assert.notEqual(response.body.data.token, null);

  // Make sure event to send mail is dispatched
  const recentEvent = Event.pullRecent();
  assert.equal(recentEvent.event, 'new::user');
  Event.restore();
});

test('user can signup via email as driver and get welcome mail', async ({
  client,
  assert
}) => {
  Event.fake();

  const userData = {
    name: 'Joeh Doeh',
    email: 'joeh@example.com',
    password: 'mySecurePassword2',
    phone_number: '22344355',
    role: 'driver'
  };

  const response = await client
    .post('api/auth/register')
    .send(userData)
    .end();

  response.assertStatus(200);
  assert.notEqual(response.body.data.token, null);

  // Make sure event to send mail is dispatched
  const recentEvent = Event.pullRecent();
  assert.equal(recentEvent.event, 'new::user');
  Event.restore();
});

// test('user cannot login if the email is not verified', async ({ client }) => {
//   const userData = {
//     name: 'Joeh Doeh',
//     email: 'joeh@example.com'
//   };

//   const response = await client
//     .post('api/auth/login')
//     .send(userData)
//     .end();

//   response.assertStatus(403);
//   console.log(response);

//   response.assertError({
//     status: 'error',
//     message: 'Your email address is not confirmed!'
//   });
// });
