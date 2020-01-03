'use strict';

class ReportUser {
  get rules() {
    return {
      // validation rules
      reason: 'required',
      user_id: 'required|exists:users,id'
    };
  }

  get messages() {
    return {
      'reason.required': 'You must provide a reason for reporting the user.',
      'user_id.required': 'You must provide a user id to report.',
      'user_id.exists': 'You must provide an existing user id.'
    };
  }
}

module.exports = ReportUser;
