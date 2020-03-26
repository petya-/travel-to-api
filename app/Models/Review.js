'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Review extends Model {
  /**
   * A relationship on trips
   *
   * @method users
   *
   * @return {Object}
   */
  trip() {
    return this.belongsTo('App/Models/Trip');
  }

  /**
   * A relationship on users
   *
   * @method users
   *
   * @return {Object}
   */
  user() {
    return this.belongsTo('App/Models/User');
  }
}

module.exports = Review;
