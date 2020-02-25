'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Car extends Model {
  /**
   * A relationship on user
   * @method driver
   * @return {Object}
   */
  driver() {
    return this.belongsTo('App/Models/User', 'driver_id', 'id');
  }
}

module.exports = Car;
