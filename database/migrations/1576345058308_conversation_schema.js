'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ConversationSchema extends Schema {
  up() {
    this.create('conversations', table => {
      table.increments();
      table.boolean('active').default(true);
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
    this.drop('conversations');
  }
}

module.exports = ConversationSchema;
