'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TripSchema extends Schema {
  up() {
    this.create('trips', (table) => {
      table.increments()
      table.string('from').notNullable()
      table.string('to').notNullable()

      table.datetime('departure').notNullable()
      table.integer('numberOfPassengers').notNullable().default(1)
      table.decimal('price').notNullable().default(0)
      table.boolean('requiresContact').notNullable().default(true)
      table.integer('driver_id').unsigned().index()
      table.foreign('driver_id').references('id').on('users').onDelete('cascade')
      table.timestamps()
    })
  }

  down() {
    this.drop('trips')
  }
}

module.exports = TripSchema
