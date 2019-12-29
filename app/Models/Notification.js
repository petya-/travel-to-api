'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Notification extends Model {
  /**
   * A relationship on user
   *
   * @method tripRequests
   *
   * @return {Object}
   */
  user() {
    return this.belongsTo('App/Models/User');
  }
}

module.exports = Notification;
