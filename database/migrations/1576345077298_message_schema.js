'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MessageSchema extends Schema {
  up() {
    this.create('messages', table => {
      table.increments();
      table.text('message').notNullable();
      table.datetime('read').nullable();
      table
        .integer('sender_id')
        .unsigned()
        .index();
      table
        .foreign('sender_id')
        .references('id')
        .on('users')
        .onDelete('cascade');
      table
        .integer('receiver_id')
        .unsigned()
        .index();
      table
        .foreign('receiver_id')
        .references('id')
        .on('users')
        .onDelete('cascade');
      table
        .integer('conversation_id')
        .unsigned()
        .index();
      table
        .foreign('conversation_id')
        .references('id')
        .on('conversations')
        .onDelete('cascade');
      table.timestamps();
    });
  }

  down() {
    this.drop('messages');
  }
}

module.exports = MessageSchema;
