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
const { DateTime } = require('luxon');

// User blueprint
Factory.blueprint('App/Models/User', (faker, i, data) => {
  return {
    email: data.email || faker.email(),
    password:
      data.password ||
      faker.string({
        length: 8
      }),
    phone_number: faker.phone(),
    name: faker.name(),
    email_verified: true
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
    from: data.from || faker.city(),
    to: data.to || faker.city(),
    departure_time: data.departure_time || DateTime.utc().toISO(),
    number_of_passengers:
      data.number_of_passengers ||
      faker.integer({
        min: 0,
        max: 3
      }),
    price: faker.integer({
      min: 4,
      max: 10
    }),
    rules: data.rules || null,
    driver_id: data.driver_id
  };
});

// Trip request blueprint
Factory.blueprint('App/Models/TripRequest', (faker, i, data) => {
  return {
    status: data.status || 'Pending',
    trip_id: data.trip_id,
    user_id: data.user_id
  };
});

// Conversation blueprint
Factory.blueprint('App/Models/Conversation', (faker, i, data) => {
  return {
    trip_id: data.trip_id,
    trip_request_id: data.trip_request_id,
    creator_id: data.creator_id
  };
});

// Message blueprint
Factory.blueprint('App/Models/Message', (faker, i, data) => {
  return {
    message: faker.sentence(),
    sender_id: data.sender_id,
    receiver_id: data.receiver_id,
    conversation_id: data.conversation_id
  };
});

// Car blueprint
Factory.blueprint('App/Models/Car', (faker, i, data) => {
  return {
    license_plate: faker.string(),
    brand: 'BMW',
    model: 'i8',
    color: '#FF0000',
    driver_id: data.driver_id
  };
});
