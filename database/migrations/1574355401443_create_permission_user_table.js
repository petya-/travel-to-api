'use strict'

const Schema = use('Schema')

class PermissionUserTableSchema extends Schema {
  up() {
    this.create('permission_user', table => {
      table.increments()
      table.integer('permission_id').unsigned().index()
      table.foreign('permission_id').references('id').on('permissions').onDelete('cascade')
      table.integer('user_id').unsigned().index()
      table.foreign('user_id').references('id').on('users').onDelete('cascade')
      table.timestamp('created_at').defaultTo(this.fn.now())
      table.timestamp('updated_at').defaultTo(this.fn.now())
    })
  }

  down() {
    this.drop('permission_user')
  }
}

module.exports = PermissionUserTableSchema
