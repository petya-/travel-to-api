'use strict';

class StoreTrip {
  get rules() {
    return {
      // validation rules
      from: 'required|string',
      to: 'required|string',
      departure_time: 'required|date',
      number_of_passengers: 'required|number',
      price: 'required'
    };
  }

  get messages() {
    return {
      'from.required': 'You must provide a start destination of the trip.',
      'from.string': 'You must provide a start destination as a string.',
      'to.required': 'You must provide an end destination of the trip.',
      'to.string': 'You must provide an end destination as a string.',
      'departure_time.required':
        'You must provide a departure time of the trip.',
      'departure_time.date':
        'You must provide a valid date for departure time.',
      'number_of_passengers.required':
        'You must provide a number of passenger this trip can accept.',
      'number_of_passengers.number':
        'You must provide a number of passengers as an integer.',
      'price.required': 'You must provide a price for the trip'
    };
  }
}

module.exports = StoreTrip;
