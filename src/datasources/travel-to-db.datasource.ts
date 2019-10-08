import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import {juggler} from '@loopback/repository';

@lifeCycleObserver('datasource')
export class TravelToDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'travel_to_db';

  constructor(
    @inject('datasources.config.travel_to_db', {optional: true})
    dsConfig: object = {
      name: process.env.DB_NAME,
      connector: process.env.DB_CONNECTOR,
      hostname: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
  ) {
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
