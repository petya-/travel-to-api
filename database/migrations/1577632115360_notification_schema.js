'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class NotificationSchema extends Schema {
  up() {
    this.create('notifications', table => {
      table.increments();
      table.text('message').notNullable();
      table
        .integer('creator_id')
        .unsigned()
        .index();
      table
        .foreign('creator_id')
        .references('id')
        .on('users')
        .onDelete('cascade');
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
        .integer('trip_request_id')
        .unsigned()
        .index();
      table
        .foreign('trip_request_id')
        .references('id')
        .on('trip_requests')
        .onDelete('cascade');
      table.timestamps();
    });
  }

  down() {
    this.drop('notifications');
  }
}

module.exports = NotificationSchema;
