'use strict';
const { test, trait, before, after } = use('Test/Suite')('Car');
const User = use('App/Models/User');
const Car = use('App/Models/Car');

trait('Test/ApiClient');
trait('Auth/Client');

let driverUser, passengerUser, newCar;

before(async () => {
  driverUser = await User.findBy('email', 'driver@travel-to.com');
  passengerUser = await User.findBy('email', 'passenger@travel-to.com');
  newCar = {
    license_plate: '18-D-12345',
    brand: 'BMW',
    model: 'i8',
    color: '#FF0000',
    driver_id: driverUser.id
  };
});

test('non-authenticated user cannot add a new car', async ({ client }) => {
  const response = await client
    .post('api/cars')
    .send(newCar)
    .end();

  response.assertStatus(401);
  response.assertError([
    'InvalidJwtToken: E_INVALID_JWT_TOKEN: jwt must be provided'
  ]);
});

test('non-driver user cannot add a new car', async ({ client, assert }) => {
  const response = await client
    .post('api/cars')
    .loginVia(passengerUser, 'jwt')
    .send(newCar)
    .end();

  response.assertStatus(403);
  response.assertError(
    'ForbiddenException: Access forbidden. You are not allowed to this resource.'
  );
});

test('driver user can add a new car', async ({ client }) => {
  const response = await client
    .post('api/cars')
    .loginVia(driverUser, 'jwt')
    .send(newCar)
    .end();

  const createdCar = await Car.query()
    .where('license_plate', newCar.license_plate)
    .first();

  response.assertStatus(200);
  response.assertJSON({
    status: 'success',
    data: createdCar.toJSON()
  });
});

test('driver can get his cars', async ({ client }) => {
  const driverCars = await driverUser.cars().fetch();
  const response = await client
    .get('api/cars')
    .loginVia(driverUser)
    .end();

  response.assertStatus(200);
  response.assertJSON({
    status: 'success',
    data: driverCars.toJSON()
  });
});
