'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const TripRequest = use('App/Models/TripRequest');
const Event = use('Event');

/**
 * Resourceful controller for interacting with triprequests
 */
class TripRequestController {
  /**
   * Show a list of all trip requests.
   * GET tripRequests
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async index({ response }) {
    try {
      const tripRequests = await TripRequest.all();
      response.status(200).json({
        status: 'success',
        data: tripRequests
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create/save a new trip request.
   * POST tripRequests
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async store({ request, response, auth }) {
    try {
      const tripRequest = await auth.user.tripRequests().create({
        number_of_passengers: request.input('number_of_passengers'),
        trip_id: request.input('trip_id'),
        status: 'Pending'
      });
      Event.fire('new::tripRequest', tripRequest, request, auth.user);

      return response.json({
        status: 'success',
        message: 'You have successfully requested a trip!',
        data: tripRequest
      });
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message:
          'There was a problem while requesting the trip, please try again later.'
      });
    }
  }

  /**
   * Get a single triprequest.
   * GET tripRequests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.params
   * @param {Response} ctx.response
   */
  async show({ params, response }) {
    try {
      const { id } = params;
      const tripRequest = await TripRequest.findOrFail(id);

      response.status(200).json({
        status: 'success',
        data: tripRequest
      });
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Update triprequest details.
   * PUT or PATCH tripRequests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Accept a triprequest.
   * PUT tripRequests/:id/accept
   *
   * @param {object} ctx
   * @param {Request} ctx.params
   * @param {Response} ctx.response
   */
  async accept({ params, response }) {
    try {
      const { id } = params;
      const tripRequest = await TripRequest.findOrFail(id);
      if (tripRequest.status === 'Pending') {
        tripRequest.status = 'Accepted';
        await tripRequest.save();

        return response.status(200).json({
          status: 'success',
          data: tripRequest
        });
      }
      return response.status(400).json({
        status: 'error',
        message: 'You can accept only a Pending request'
      });
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Reject a triprequest.
   * PUT tripRequests/:id/reject
   *
   * @param {object} ctx
   * @param {Request} ctx.params
   * @param {Response} ctx.response
   */
  async reject({ params, response }) {
    try {
      const { id } = params;
      const tripRequest = await TripRequest.findOrFail(id);
      if (tripRequest.status === 'Pending') {
        tripRequest.status = 'Rejected';
        await tripRequest.save();

        return response.status(200).json({
          status: 'success',
          data: tripRequest
        });
      }
      return response.status(400).json({
        status: 'error',
        message: 'You can reject only a Pending request'
      });
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Delete a triprequest with id.
   * DELETE triprequests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = TripRequestController;
