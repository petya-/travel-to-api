const { group, test } = use('Test/Suite')('Trip Validators');
const StoreTripValidator = use('App/Validators/StoreTrip');
const { validate } = use('Validator');
const { DateTime } = require('luxon');

// StoreTrip validator
test('StoreTrip. Validate trip from is required', async ({ assert }) => {
  const tripValidator = new StoreTripValidator();

  const validation = await validate(
    {
      from: ''
    },
    tripValidator.rules,
    tripValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'from',
      message: 'You must provide a start destination of the trip.',
      validation: 'required'
    }
  ]);
});

test('StoreTrip. Validate trip from is a string', async ({ assert }) => {
  const tripValidator = new StoreTripValidator();

  const validation = await validate(
    {
      from: 123
    },
    tripValidator.rules,
    tripValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'from',
      message: 'You must provide a start destination as a string.',
      validation: 'string'
    }
  ]);
});

test('StoreTrip. Validate trip to is required', async ({ assert }) => {
  const tripValidator = new StoreTripValidator();

  const validation = await validate(
    {
      from: 'Sofia',
      to: ''
    },
    tripValidator.rules,
    tripValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'to',
      message: 'You must provide an end destination of the trip.',
      validation: 'required'
    }
  ]);
});

test('StoreTrip. Validate trip to is a string', async ({ assert }) => {
  const tripValidator = new StoreTripValidator();

  const validation = await validate(
    {
      from: 'Plovdiv',
      to: 234
    },
    tripValidator.rules,
    tripValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'to',
      message: 'You must provide an end destination as a string.',
      validation: 'string'
    }
  ]);
});

test('StoreTrip. Validate trip departure_time is required', async ({
  assert
}) => {
  const tripValidator = new StoreTripValidator();

  const validation = await validate(
    {
      from: 'Sofia',
      to: 'Plovdiv',
      departure_time: ''
    },
    tripValidator.rules,
    tripValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'departure_time',
      message: 'You must provide a departure time of the trip.',
      validation: 'required'
    }
  ]);
});

test('StoreTrip. Validate trip departure_time is a date', async ({
  assert
}) => {
  const tripValidator = new StoreTripValidator();

  const validation = await validate(
    {
      from: 'Plovdiv',
      to: 'Sofia',
      departure_time: '2019-31-16'
    },
    tripValidator.rules,
    tripValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'departure_time',
      message: 'You must provide a valid date for departure time.',
      validation: 'date'
    }
  ]);
});

test('StoreTrip. Validate trip number_of_passengers is required', async ({
  assert
}) => {
  const tripValidator = new StoreTripValidator();

  const validation = await validate(
    {
      from: 'Sofia',
      to: 'Plovdiv',
      departure_time: DateTime.utc().toISO(),
      number_of_passengers: ''
    },
    tripValidator.rules,
    tripValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'number_of_passengers',
      message: 'You must provide a number of passenger this trip can accept.',
      validation: 'required'
    }
  ]);
});

test('StoreTrip. Validate trip number_of_passengers is a number', async ({
  assert
}) => {
  const tripValidator = new StoreTripValidator();

  const validation = await validate(
    {
      from: 'Plovdiv',
      to: 'Sofia',
      departure_time: DateTime.utc().toISO(),
      number_of_passengers: 'abv'
    },
    tripValidator.rules,
    tripValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'number_of_passengers',
      message: 'You must provide a number of passengers as an integer.',
      validation: 'number'
    }
  ]);
});

test('StoreTrip. Validate trip price is required', async ({ assert }) => {
  const tripValidator = new StoreTripValidator();

  const validation = await validate(
    {
      from: 'Sofia',
      to: 'Plovdiv',
      departure_time: DateTime.utc().toISO(),
      number_of_passengers: 1,
      price: ''
    },
    tripValidator.rules,
    tripValidator.messages
  );

  assert.isTrue(validation.fails());

  assert.deepEqual(validation.messages(), [
    {
      field: 'price',
      message: 'You must provide a price for the trip',
      validation: 'required'
    }
  ]);
});

test('StoreTrip. Validate trip accepts a valid trip', async ({ assert }) => {
  const tripValidator = new StoreTripValidator();

  const validation = await validate(
    {
      from: 'Sofia',
      to: 'Plovdiv',
      departure_time: DateTime.utc().toISO(),
      number_of_passengers: 1,
      price: 12
    },
    tripValidator.rules,
    tripValidator.messages
  );

  assert.isFalse(validation.fails());
  assert.isNull(validation.messages());
});
