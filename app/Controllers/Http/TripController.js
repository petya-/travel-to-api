'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/auth')} Auth */

const Trip = use('App/Models/Trip');
const Event = use('Event');
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
            query.whereBetween('departure_time', [startDate, endDate]);
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
        departure_time: request.input('departure_time'),
        number_of_passengers: request.input('number_of_passengers'),
        price: request.input('price'),
        lng: request.input('lng'),
        lat: request.input('lat'),
        status: 'Pending'
      });
      return response.json({
        status: 'success',
        message: 'Trip was successfully created!',
        data: trip
      });
    } catch (error) {
      return response.status(500).json({
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
      const { user } = auth;
      const driverTrips = await user.trips().fetch();
      const passengerTrips = await Trip.query()
        .whereHas('tripRequests', builder => {
          builder.where('user_id', user.id);
        })
        .fetch();
      const trips = {
        driver: driverTrips,
        passenger: passengerTrips
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
      trip.tripRequests = await trip.tripRequests().fetch();
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
   * Cancel a trip
   * GET trips/:id/cancel
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Params} ctx.params
   * @param {Auth} ctx.auth
   */
  async cancel({ response, params, auth }) {
    try {
      const { id } = params;
      const { user } = auth;

      const trip = await Trip.find(id);
      trip.status = 'Cancelled';
      await trip.save();

      Event.fire('cancel::trip', trip, user);

      return response.status(200).json({
        status: 'success',
        data: trip
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'There was an error while cancelling the trip.'
      });
    }
  }

  /**
   * Update trip details.
   * PUT trips/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async update({ params, request, response, auth }) {
    try {
      const { id } = params;
      const { user } = auth;

      const updatedTrip = request.only([
        'departure_time',
        'number_of_passengers',
        'price'
      ]);
      let trip = await Trip.find(id);

      // The merge method only modifies the specified attributes from the request
      await trip.merge(updatedTrip);
      await trip.save();

      Event.fire('update::trip', trip, user);

      return response.status(200).json({
        status: 'success',
        data: trip
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'There was an error while updating the trip.'
      });
    }
  }
}

module.exports = TripController;
