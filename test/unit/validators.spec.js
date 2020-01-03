const { test } = use('Test/Suite')('Validators');
const StoreUserValidator = use('App/Validators/StoreUser');
const { validate } = use('Validator');

test('validate user email must be an email', async ({ assert }) => {
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

test('validate user password is required', async ({ assert }) => {
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

test('validate user password lenght', async ({ assert }) => {
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

test('validate user phone_number is required', async ({ assert }) => {
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

test('validate user phone_number lenght', async ({ assert }) => {
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
