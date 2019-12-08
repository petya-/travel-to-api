'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/auth')} Auth */

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
   * @param {Response} ctx.response
   */
  async index({ response }) {
    try {
      const trips = await Trip.all();
      response.status(200).json({
        status: 'success',
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
   * @param {Auth} ctx.auth
   */
  async create({ request, response, auth }) {
    try {
      const trip = await auth.user.trips().create({
        from: request.input('from'),
        to: request.input('to'),
        departure: request.input('departure'),
        numberOfPassengers: request.input('numberOfPassengers'),
        price: request.input('price'),
        requiresContact: request.input('requiresContact')
          ? request.input('requiresContact')
          : true
      });
      return response.json({
        status: 'success',
        message: 'Trip was successfully created!',
        data: trip
      });
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message:
          'There was a problem creating the trip, please try again later.'
      });
    }
  }

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
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth

   */
  async show({ response, auth }) {
    try {
      const trips = await auth.user.trips().fetch();
      response.status(200).json({
        status: 'success',
        data: trips
      });
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'An error occurred.'
      });
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
