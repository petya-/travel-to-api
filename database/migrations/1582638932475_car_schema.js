'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CarSchema extends Schema {
  up() {
    this.create('cars', table => {
      table.increments();
      table.string('license_plate').nullable();
      table.string('brand');
      table.string('model').nullable();
      table.string('color');
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
    this.drop('cars');
  }
}

module.exports = CarSchema;
