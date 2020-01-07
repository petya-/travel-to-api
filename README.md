# Adonis fullstack application

This is the fullstack boilerplate for AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Session
3. Authentication
4. Web security middleware
5. CORS
6. Edge template engine
7. Lucid ORM
8. Migrations and seeds

## Setup

Use the adonis command to install the blueprint

```bash
adonis new yardstick
```

or manually clone the repo and then run `npm install`.

## Environment Setup

Create a `.env` file from `.env.example` and add populate it with the database and email connection

```bash
copy .env.example .env
```

### Generate App Key

Run the following command to generate an application key:

```js
adonis key:generate
```

### Migrations and Seeders

Run the following command to run startup migrations and seeders.

```js
npm run migrate:seed
```

## Deployment

The API is deployed on [Heroku](https://travel-to-api.herokuapp.com)

## Documentation

[API Docs](https://travel-to-api.herokuapp.com/docs/)
