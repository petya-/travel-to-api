'use strict'

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
const Factory = use('Factory')

// User blueprint
Factory.blueprint('App/Models/User', (faker, i, data) => {
  return {
    email: data && data.email ? data.email : faker.email(),
    password: data && data.password ? data.password : faker.string({
      length: 8
    }),
    phoneNumber: faker.phone(),
    name: faker.name(),
    emailVerified: true
  }
})

// Role blueprint
Factory.blueprint('Adonis/Acl/Role', (faker, i, data) => {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description
  }
})

// Permission blueprint
Factory.blueprint('Adonis/Acl/Role', (faker, i, data) => {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description
  }
})
