'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with cars
 */
class CarController {
  /**
   * Show a list of all cars for a driver
   * GET cars
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async index({ response, auth }) {
    const cars = await auth.user.cars().fetch();

    response.status(200).json({
      status: 'success',
      data: cars
    });
  }

  /**
   * Create/save a new car.
   * POST cars
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async store({ request, response, auth }) {
    const { license_plate, brand, model, color } = request.all();

    try {
      const car = await auth.user.cars().create({
        license_plate,
        brand,
        model,
        color
      });

      return response.json({ status: 'success', data: car });
    } catch (error) {
      response.status(403).json({ status: 'error', message: err.message });
    }
  }

  /**
   * Display a single car.
   * GET cars/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Update car details.
   * PUT or PATCH cars/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a car with id.
   * DELETE cars/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = CarController;
