'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TripRequestSchema extends Schema {
  up() {
    this.create('trip_requests', (table) => {
      table.increments()
      table.string('status').notNullable().default("Pending")
      table.integer('numberOfPassengers').notNullable().default(1)
      table.integer('trip_id').unsigned().index()
      table.foreign('trip_id').references('id').on('trips').onDelete('cascade')
      table.integer('user_id').unsigned().index()
      table.foreign('user_id').references('id').on('users').onDelete('cascade')
      table.timestamps()
    })
  }

  down() {
    this.drop('trip_requests')
  }
}

module.exports = TripRequestSchema
