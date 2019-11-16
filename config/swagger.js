'use strict'
const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Swagger Information
  | Please use Swagger 2 Spesification Docs
  | https://swagger.io/docs/specification/2-0/basic-structure/
  |--------------------------------------------------------------------------
  */

  enable: true,
  specUrl: '/swagger.json',

  options: {
    swaggerDefinition: {
      info: {
        title: 'travel-to-api',
        description: 'API description in Markdown.',
        version: '1.0.0',
      },
      host: Env.get('APP_HOST'),
      basePath: '/api',

      // Example security definitions.
      securityDefinitions: {
        // OAuth2 configuration
        OAuth2: {
          authorizationUrl: 'https://example.com/oauth/authorize',
          tokenUrl: 'https://example.com/oauth/token',
        },
      }
    },

    // Path to the API docs
    // Sample usage
    // apis: [
    //    'docs/**/*.yml',    // load recursive all .yml file in docs directory
    //    'docs/**/*.js',     // load recursive all .js file in docs directory
    // ]
    apis: [
      'app/**/*.js',
      'app/**/*.yml',
      'start/routes.js',
    ]
  }
}
