'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/auth')} Auth */

const Trip = use('App/Models/Trip');
const { DateTime } = require('luxon');

/**
 * Resourceful controller for interacting with trips
 */
class TripController {
  /**
   * Show a list of all trips.
   * GET trips
   *
   * @param {object} ctx
   * @param {Response} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response }) {
    try {
      let startDate,
        endDate = null;
      if (request.input('date')) {
        const inputDate = DateTime.fromISO(request.input('date'), {
          zone: 'utc'
        });
        startDate = inputDate.startOf('day').toISO();
        endDate = inputDate.endOf('day').toISO();
      }
      const trips = await Trip.query()
        .where('status', 'Pending')
        .optional(query => query.where('from', request.input('from')))
        .optional(query => {
          query.where('to', request.input('to'));
        })
        .optional(query => {
          if (startDate && endDate) {
            query.whereBetween('departureTime', [startDate, endDate]);
          }
        })
        .with('driver')
        .fetch();
      response.status(200).json({
        status: 'success',
        data: trips
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create/save a new trip.
   * POST trips
   *
   * @param {object} ctx
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async store({ request, response, auth }) {
    try {
      const trip = await auth.user.trips().create({
        from: request.input('from'),
        to: request.input('to'),
        departureTime: request.input('departureTime'),
        numberOfPassengers: request.input('numberOfPassengers'),
        price: request.input('price'),
        requiresContact: request.input('requiresContact') || true,
        status: 'Pending'
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
   * Get a single trip.
   * GET trips/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Params} ctx.params

   */
  async show({ response, params }) {
    try {
      const { id } = params;
      const trip = await Trip.query()
        .where('id', id)
        .with('driver')
        .first();

      response.status(200).json({
        status: 'success',
        data: trip
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Display user trips.
   * GET trips/user
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth

   */
  async indexUserTrips({ response, auth }) {
    try {
      const driverTrips = await auth.user.trips().fetch();
      const tripRequests = await auth.user.tripRequests().fetch();
      const trips = {
        driver: driverTrips,
        passenger: tripRequests
      };
      response.status(200).json({
        status: 'success',
        data: trips
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'An error occurred.'
      });
    }
  }

  /**
   * Get a trip with trip requests
   * GET trips/:id/tripRequests
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Params} ctx.params
   */
  async showTripRequests({ params, response }) {
    try {
      const { id } = params;
      const trip = await Trip.findOrFail(id);
      trip.tripRequests = await trip.tripRequests;
      response.status(200).json({
        status: 'success',
        data: trip
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: error.message
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
