import 'reflect-metadata';
import express from 'express';

import config from './config';
import Logger from './logger';


async function createApp() {
  const app = express();

  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node 10 without babel and at the time of writing
   * So we are using good old require.
   **/
  await require('./loaders').default({ expressApp: app });
  return app;

}

createApp().then(app => {
  app.listen(config.port, () => {
    Logger.info('Server is running', {
      port: config.port
    });
  }).on('error', (err: Error) => {
    Logger.error(err);
    process.exit(1);
  });
});
