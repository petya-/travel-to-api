'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Trip extends Model {


  // /**
  //  * A relationship on trips
  //  *
  //  * @method trips
  //  *
  //  * @return {Object}
  //  */
  users() {
    return this.belongsTo('App/Models/User', 'id', 'driver_id')
  }
}

module.exports = Trip
