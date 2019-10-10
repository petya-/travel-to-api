# TravelTo API

RESTful API for TravelTo app.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Make sure you have PostgreSQL and Node.js installed.

### Installing

Here's how to get this project up and running:

> Setup env file
> Create a .env file from .env.example and add your postgres user and password

> Install dependencies

```
npm i
```

> Migrate the database

```
npm run migrate
```

> Add mock data

```
npm run seed
```

> Run the server

```
npm start
```

That's all folks

## Running the tests

```
npm test
```

## Deployment

The app is deployed to Heroku after all the checks(CI build and test jobs) on the master branch have passed. 

## Built With

- [LoopBack](http://loopback.io/)
- [PostgreSQL](https://www.postgresql.org/)

## Authors

- **Petya Buchkova** - _Initial work_ - [petya-](https://github.com/petya-)
