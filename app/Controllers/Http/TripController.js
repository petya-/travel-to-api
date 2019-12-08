'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Trip = use('App/Models/Trip');

/**
 * Resourceful controller for interacting with trips
 */
class TripController {
  /**
   * Show a list of all trips.
   * GET trips
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    try {
      const trips = await Trip.all();
      response.status(200).json({
        message: 'success',
        data: trips
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Render a form to be used for creating a new trip.
   * GET trips/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new trip.
   * POST trips
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single trip.
   * GET trips/user
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show({ params, request, response, auth }) {
    try {
      const trips = await auth.user.trips().fetch();
      response.status(200).json({
        message: 'success',
        data: trips
      });
    } catch (error) {
      console.lot(error);
      throw error;
    }
  }

  /**
   * Update trip details.
   * PUT or PATCH trips/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a trip with id.
   * DELETE trips/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = TripController;
