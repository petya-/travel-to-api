'use strict'

const Schema = use('Schema')

class RoleUserTableSchema extends Schema {
  up() {
    this.create('role_user', table => {
      table.increments()
      table.integer('role_id').unsigned().index()
      table.foreign('role_id').references('id').on('roles').onDelete('cascade')
      table.integer('user_id').unsigned().index()
      table.foreign('user_id').references('id').on('users').onDelete('cascade')
      table.timestamp('created_at').defaultTo(this.fn.now())
      table.timestamp('updated_at').defaultTo(this.fn.now())
    })
  }

  down() {
    this.drop('role_user')
  }
}

module.exports = RoleUserTableSchema
