'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TripSchema extends Schema {
  up() {
    this.create('trips', table => {
      table.increments();
      table.string('from').notNullable();
      table.string('to').notNullable();
      table.datetime('departure_time').notNullable();
      table
        .integer('number_of_passengers')
        .notNullable()
        .default(1);
      table.decimal('price').notNullable();
      table
        .string('status')
        .notNullable()
        .default('Pending');
      table.string('lat_start').nullable();
      table.string('lng_start').nullable();
      table.string('lat_end').nullable();
      table.string('lng_end').nullable();
      table.json('rules').nullable();
      table
        .integer('driver_id')
        .unsigned()
        .index();
      table
        .foreign('driver_id')
        .references('id')
        .on('users')
        .onDelete('cascade');
      table.timestamps();
    });
  }

  down() {
    this.drop('trips');
  }
}

module.exports = TripSchema;
