'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with triprequests
 */
class TripRequestController {
  /**
   * Show a list of all triprequests.
   * GET triprequests
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
   * Create/save a new triprequest.
   * POST triprequests
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async store({ request, response, auth }) {
    try {
      const tripRequest = await auth.user.tripRequests().create({
        numberOfPassengers: request.input('numberOfPassengers'),
        trip_id: request.input('trip_id'),
        status: 'Pending'
      });
      return response.json({
        status: 'success',
        message: 'You have successfully requested a trip!',
        data: tripRequest
      });
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        status: 'error',
        message:
          'There was a problem while requesting the trip, please try again later.'
      });
    }
  }

  /**
   * Display a single triprequest.
   * GET triprequests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const variable = 1;
  }

  /**
   * Render a form to update an existing triprequest.
   * GET triprequests/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update triprequest details.
   * PUT or PATCH triprequests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

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
