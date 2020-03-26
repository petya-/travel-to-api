'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ReviewSchema extends Schema {
  up() {
    this.create('reviews', table => {
      table.increments();
      table.text('text').notNullable();
      table
        .integer('trip_id')
        .unsigned()
        .index();
      table
        .foreign('trip_id')
        .references('id')
        .on('trips')
        .onDelete('cascade');
      table
        .integer('user_id')
        .unsigned()
        .index();
      table
        .foreign('user_id')
        .references('id')
        .on('users')
        .onDelete('cascade');
      table.timestamps();
    });
  }

  down() {
    this.drop('reviews');
  }
}

module.exports = ReviewSchema;
