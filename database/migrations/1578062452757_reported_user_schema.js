'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ReportedUserSchema extends Schema {
  up() {
    this.create('reported_users', table => {
      table.increments();
      table.text('reason').notNullable();
      table
        .boolean('approved')
        .notNullable()
        .default(false);
      table
        .integer('reporter_id')
        .unsigned()
        .index();
      table
        .foreign('reporter_id')
        .references('id')
        .on('users')
        .onDelete('cascade');
      table
        .integer('reported_id')
        .unsigned()
        .index();
      table
        .foreign('reported_id')
        .references('id')
        .on('users')
        .onDelete('cascade');
      table.timestamps();
    });
  }

  down() {
    this.drop('reported_users');
  }
}

module.exports = ReportedUserSchema;
