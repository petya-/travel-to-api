'use strict';

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const {
  DateTime
} = require('luxon');

// User blueprint
Factory.blueprint('App/Models/User', (faker, i, data) => {
  return {
    email: data.email || faker.email(),
    password: data.password || faker.string({
      length: 8
    }),
    phoneNumber: faker.phone(),
    name: faker.name(),
    emailVerified: true
  };
});

// Role blueprint
Factory.blueprint('Adonis/Acl/Role', (faker, i, data) => {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description
  };
});

// Permission blueprint
Factory.blueprint('Adonis/Acl/Permission', (faker, i, data) => {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description
  };
});

// Trip blueprint
Factory.blueprint('App/Models/Trip', (faker, i, data) => {
  return {
    from: faker.city(),
    to: faker.city(),
    departureTime: DateTime.utc(),
    numberOfPassengers: faker.integer({
      min: 0,
      max: 3
    }),
    price: faker.integer({
      min: 4,
      max: 10
    }),
    requiresContact: faker.bool(),
    driver_id: data.driver_id
  };
});

// Trip request blueprint
Factory.blueprint('App/Models/TripRequest', (faker, i, data) => {
  return {
    status: data.status || "Pending",
    trip_id: data.trip_id,
    user_id: data.user_id
  };
});
