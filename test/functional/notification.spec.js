'use strict';
const { test, trait, before, after } = use('Test/Suite')('User');
const User = use('App/Models/User');
const Role = use('Role');

trait('Test/ApiClient');
trait('Auth/Client');

let passengerUser, driverUser, notification;

before(async () => {
  passengerUser = await User.findBy('email', 'passenger@travel-to.com');
  driverUser = await User.findBy('email', 'driver@travel-to.com');
  notification = await passengerUser.notifications().create({
    message: 'Your trip request was accepted',
    trip_id: 21,
    trip_request_id: 7
  });
});

test('user can get a list of his notifications', async ({ client }) => {
  const response = await client
    .get('api/notifications')
    .loginVia(driverUser, 'jwt')
    .end();

  response.assertStatus(200);
  response.assertError({
    status: 'success',
    data: []
  });
});

test('user can get a list of his notifications', async ({ client }) => {
  const notifications = await passengerUser.notifications().fetch();

  const response = await client
    .get('api/notifications')
    .loginVia(passengerUser, 'jwt')
    .end();

  response.assertStatus(200);
  response.assertError({
    status: 'success',
    data: notifications.toJSON()
  });
});

test('user can mark a notification as read', async ({ client, assert }) => {
  assert.equal(notification.read, null);

  const response = await client
    .put(`api/notifications/${notification.id}`)
    .loginVia(passengerUser, 'jwt')
    .end();

  response.assertStatus(200);
  assert.notEqual(response.body.data.read, null);
});
