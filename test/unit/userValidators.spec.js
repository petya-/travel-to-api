const { group, test } = use('Test/Suite')('User Validators');
const StoreUserValidator = use('App/Validators/StoreUser');
const ReportUserValidator = use('App/Validators/ReportUser');
const { validate } = use('Validator');

// StoreUser validator
test('StoreUser. Validate user email must be an email', async ({ assert }) => {
  const userValidator = new StoreUserValidator();

  const validation = await validate(
    {
      name: 'Petya Buchkova',
      email: 'somefakeemail.com'
    },
    userValidator.rules,
    userValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'email',
      message: 'You must provide a valid email address.',
      validation: 'email'
    }
  ]);
});

test('StoreUser. Validate user password is required', async ({ assert }) => {
  const userValidator = new StoreUserValidator();

  const validation = await validate(
    {
      name: 'Petya Buchkova',
      email: 'somefakeemail@mail.com',
      password: ''
    },
    userValidator.rules,
    userValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'password',
      message: 'You must provide a password.',
      validation: 'required'
    }
  ]);
});

test('StoreUser. Validate user password lenght', async ({ assert }) => {
  const userValidator = new StoreUserValidator();

  const validation = await validate(
    {
      name: 'Petya Buchkova',
      email: 'somefakeemail@mail.com',
      password: '1234567'
    },
    userValidator.rules,
    userValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'password',
      message: 'You must provide a password with at least 8 characters.',
      validation: 'min'
    }
  ]);
});

test('StoreUser. Validate user phone_number is required', async ({
  assert
}) => {
  const userValidator = new StoreUserValidator();

  const validation = await validate(
    {
      name: 'Petya Buchkova',
      email: 'somefakeemail@mail.com',
      password: '12345678',
      phone_number: ''
    },
    userValidator.rules,
    userValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'phone_number',
      message: 'You must provide a phone number.',
      validation: 'required'
    }
  ]);
});

test('StoreUser. Validate user phone_number lenght', async ({ assert }) => {
  const userValidator = new StoreUserValidator();

  const validation = await validate(
    {
      name: 'Petya Buchkova',
      email: 'somefakeemail@mail.com',
      password: '12345678',
      phone_number: '123'
    },
    userValidator.rules,
    userValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'phone_number',
      message: 'You must provide a phone number with at least 6 digits.',
      validation: 'min'
    }
  ]);
});

// ReportUser validator
test('ReportUser. Validate reported user_id is required', async ({
  assert
}) => {
  const reportUserValidator = new ReportUserValidator();

  const validation = await validate(
    {
      user_id: '',
      reason: 'The driver did not show up.'
    },
    reportUserValidator.rules,
    reportUserValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'user_id',
      message: 'You must provide a user id to report.',
      validation: 'required'
    }
  ]);
});

test('ReportUser. Validate reported user exists', async ({ assert }) => {
  const reportUserValidator = new ReportUserValidator();

  const validation = await validate(
    {
      user_id: 245,
      reason: 'The driver did not show up.'
    },
    reportUserValidator.rules,
    reportUserValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'user_id',
      message: 'You must provide an existing user id.',
      validation: 'exists'
    }
  ]);
});

test('ReportUser. Validate reason is required', async ({ assert }) => {
  const reportUserValidator = new ReportUserValidator();

  const validation = await validate(
    {
      user_id: 2,
      reason: ''
    },
    reportUserValidator.rules,
    reportUserValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'reason',
      message: 'You must provide a reason for reporting the user.',
      validation: 'required'
    }
  ]);
});
