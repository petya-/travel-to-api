'use strict';

class StoreUser {
  get rules() {
    return {
      // validation rules
      name: 'required',
      email: 'required|email|unique:users',
      password: 'required|min:8',
      phone_number: 'required|min:6'
    };
  }

  get messages() {
    return {
      'name.required': 'You must provide a name',
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
      'email.unique': 'This email is already registered.',
      'password.required': 'You must provide a password.',
      'password.min': 'You must provide a password with at least 8 characters.',
      'phone_number.required': 'You must provide a phone number.',
      'phone_number.min':
        'You must provide a phone number with at least 6 digits.'
    };
  }
}

module.exports = StoreUser;
