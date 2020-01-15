'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.create('users', table => {
      table.increments();
      table
        .string('email', 254)
        .notNullable()
        .unique();
      table.string('password', 60).notNullable();
      table.string('name').notNullable();
      table.string('phone_number', 20).notNullable();
      table.string('profile_img').nullable();
      table.string('description').nullable();
      table.string('provider_id').nullable();
      table.string('provider').nullable();
      table.string('token').nullable();
      table
        .boolean('email_verified')
        .notNullable()
        .defaultTo(false);
      table
        .boolean('enabled')
        .notNullable()
        .defaultTo(true);
      table.timestamps();
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = UserSchema;
